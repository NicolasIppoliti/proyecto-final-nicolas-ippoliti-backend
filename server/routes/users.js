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
  role: Joi.string().valid('user', 'admin', 'premium').default('user'),
  lastActive: Joi.date().default(Date.now),
  cart: Joi.string(),
  cid: Joi.string(),
});

router.post('/register', (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  next();
}, UserController.registerUser);

router.post('/login', UserController.loginUser);

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

router.put('/:id', isAdmin, isAuthenticated, UserController.updateUser);

router.delete('/:id', isAdmin, isAuthenticated, UserController.deleteUser);

router.get('/:email', isAdmin, isAuthenticated, async (req, res, next) => {
  try {
    const user = await UserController.getUserByEmail(req, res, next);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(toUserDto(user));
  } catch (err) {
    next(err);
  }
});

router.get('/', isAdmin, isAuthenticated, async (req, res, next) => {
  try {
    const users = await UserController.getUsers(req, res, next);
    res.json(users.map((user) => toUserDto(user)));
  } catch (err) {
    next(err);
  }
});

router.put('/premium/:uid', isAdmin, isAuthenticated, UserController.togglePremium);

router.delete('/', isAdmin, isAuthenticated, UserController.deleteInactiveUsers);

export default router;
