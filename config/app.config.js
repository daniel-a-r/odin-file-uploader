import path from 'node:path';
import crypto from 'node:crypto';
import express from 'express';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from './passport.config.js';
import helmet from 'helmet';

const app = express();
app.disable('x-powered-by');

app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(32).toString('hex');
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrcElem: [
          "'self'",
          (req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
      },
    },
  }),
);

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

export default app;
