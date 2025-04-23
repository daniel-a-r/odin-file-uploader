import { ExpressValidator, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import prisma from '../config/prismaClient.js';
import { authenticate } from '../config/passport.config.js';

const indexGet = (req, res) => {
  res.render('index', { title: 'Home' });
};

const signUpGet = (req, res) => {
  res.render('signUp', { title: 'Sign Up' });
};

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
    const rootId = crypto.randomUUID();
    await prisma.user.create({
      data: {
        username,
        password: hashPassword,
        folders: {
          create: {
            id: rootId,
            name: 'root',
            role: 'ROOT',
            parentId: rootId,
          },
        },
      },
    });
    next();
  } catch (err) {
    console.error(err);
  }
};

const signUpPost = [
  ...validateSignUp,
  checkSignUpValidationErrors,
  createUser,
  authenticate,
];

const loginGet = (req, res) => {
  res.render('login', { title: 'Login', errors: req.session.messages });
};

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

const loginPost = [
  ...validateLogin,
  checkLoginValidationErrors,
  clearSessionMessages,
  authenticate,
];

const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

export default {
  indexGet,
  signUpGet,
  signUpPost,
  loginGet,
  loginPost,
  logoutGet,
};
