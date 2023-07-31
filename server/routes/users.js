import express from 'express';
import passport from 'passport';
import * as UserController from '../controllers/UserController.js';
import UserDTO from '../dtos/UserDto.js';
import Joi from 'joi';
import { isAdmin, isAuthenticated } from '../helpers/accessControl.js';

const router = express.Router();
const toUserDto = (user) => new UserDTO(user);

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post('/register', (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}, UserController.registerUser);

router.post('/login', async (req, res, next) => {
  try {
    const user = await UserController.loginUser(req, res, next);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(toUserDto(user));
  } catch (err) {
    next(err);
  }
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  UserController.googleAuth
);

router.get('/auth/success', (req, res) => {
  res.json({ token: req.query.token });
});

router.get('/auth/failure', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

router.put('/:id', isAuthenticated, isAdmin, UserController.updateUser);

router.delete('/:id', isAuthenticated, isAdmin, UserController.deleteUser);

router.get('/:email', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const user = await UserController.getUserByEmail(req, res, next);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(toUserDto(user));
  } catch (err) {
    next(err);
  }
});

router.get('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const users = await UserController.getUsers(req, res, next);
    res.json(users.map((user) => toUserDto(user)));
  } catch (err) {
    next(err);
  }
});

router.put('/premium/:uid', isAuthenticated, isAdmin, UserController.togglePremium);

export default router;
