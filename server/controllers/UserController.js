import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import CartRepository from '../repositories/CartRepository.js';
import Mailer from '../mail/mailer.js';
import User from '../models/User.js';
import UserDTO from '../dtos/UserDto.js';

const mailer = new Mailer();
const toUserDto = (user) => new UserDTO(user);

export const registerUser = async (req, res, next) => {
  try {
    console.log(req.body)
    const user = await UserRepository.createUser(req.body);
    const cart = await CartRepository.createCart();
    console.log('Created Cart:', cart);
    const updatedCart = await CartRepository.updateCart(cart.id, { user: user._id });
    user.cid = updatedCart.id;
    user.cart = updatedCart.id;
    await UserRepository.updateUser(user._id, { cart: updatedCart.id, cid: updatedCart.id });
    res.json(toUserDto(user));
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserByEmail(req.body.email);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const isMatch = await UserRepository.comparePasswords(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: toUserDto(user) });
  } catch (err) {
    return next(err);
  }
};

export const googleAuth = (req, res) => {
  const payload = { id: req.user.id, name: req.user.name, email: req.user.email };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
    if (err) throw err;
    res.redirect(`/auth/success?token=${token}`);
  });
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return user;
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserRepository.getUsers();
    return users;
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await UserRepository.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return user;
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserRepository.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export const togglePremium = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserById(req.params.uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role === 'premium' ? 'user' : 'premium';
    await UserRepository.updateUser(user);

    return res.json({ message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteInactiveUsers = async (req, res, next) => {
  try {
    const inactivityInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
    const cutoffTime = new Date(Date.now() - inactivityInterval);

    const users = await User.find({ lastActive: { $lt: cutoffTime } });
    const emails = users.map((user) => user.email);
    
    if (emails.length > 0) {
      await mailer.sendEmail(emails, 'Your account has been deleted due to inactivity', 'Your account has been deleted due to inactivity');
    }
    
    await User.deleteMany({ lastActive: { $lt: cutoffTime } });

    res.status(200).send({ msg: 'Inactive users deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Error deleting inactive users' });
    next(err);
  }
};
