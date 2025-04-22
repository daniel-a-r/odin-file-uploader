import { config } from '@dotenvx/dotenvx';
import path from 'node:path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

config({ path: ['.env.dev'], envKeysFile: './.env.keys' });

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.use((req, res) => {
  res.render('notFound', { title: 'Not Found', errMsg: 'Page Not Found' });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
