import { config } from '@dotenvx/dotenvx';
import path from 'node:path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { ExpressValidator, validationResult } from 'express-validator';

config({ path: ['.env.dev'] });

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  }),
);
app.use(passport.session());

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

const authenticate = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true,
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

const { body } = new ExpressValidator({
  isUsernameNotInUse: async (value) => {
    // doesn't need to return true since can be resolved as a promise
    const existingUser = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });
    if (existingUser) {
      throw new Error('Username already taken');
    }
  },
  passwordsMatch: (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    // needs to return a boolean value
    return true;
  },
});

const validateSignUp = [
  body('username')
    .trim()
    .toLowerCase()
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .isUsernameNotInUse(),
  body('confirmPassword').passwordsMatch(),
];

const checkSignUpValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render('signUp', { title: 'Sign-up', errors: errors.array() });
  }
  next();
};

const createUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashPassword,
      },
    });
    next();
  } catch (err) {
    console.error(err);
  }
};

app.get('/sign-up', (req, res) => {
  res.render('signUp', { title: 'Sign Up' });
});

app.post(
  '/sign-up',
  validateSignUp,
  checkSignUpValidationErrors,
  createUser,
  authenticate,
);

const validateLogin = [
  body('username')
    .trim()
    .toLowerCase()
    .isAlphanumeric()
    .withMessage('Invalid username'),
];

const checkLoginValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // extract error messages from validation errors objects
    const errorMessages = errors.array().map((err) => err.msg);
    return res
      .status(400)
      .render('login', { title: 'Login', errors: errorMessages });
  }
  next();
};

const clearSessionMessages = (req, res, next) => {
  // clear error messages before authenticating
  req.session.messages = [];
  next();
};

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', errors: req.session.messages });
});

app.post(
  '/login',
  validateLogin,
  checkLoginValidationErrors,
  clearSessionMessages,
  authenticate,
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.use((req, res) => {
  res.render('notFound', { title: 'Not Found', errMsg: 'Page Not Found' });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
