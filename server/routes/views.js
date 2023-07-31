import express from 'express';
import { isAuthenticated } from '../helpers/accessControl.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
