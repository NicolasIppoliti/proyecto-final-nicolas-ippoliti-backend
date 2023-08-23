import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import CartRepository from '../repositories/CartRepository.js';
import sendEmail from '../mail/mailer.js';
import User from '../models/User.js';

export const registerUser = async (req, res, next) => {
  try {
    const user = await UserRepository.createUser(req.body);
    const cart = await CartRepository.createCart({ user: user._id });
    user.cart = cart._id;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserByEmail(req.body.email);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Verify password
    const isMatch = await UserRepository.comparePasswords(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id, name: user.name, email: user.email };
    const userId = user._id;
    User.findByIdAndUpdate(userId, { lastActive: Date.now() }, (err, user) => {
      if (err) {
        console.log(err);
      }
    });
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    next(err);
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
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserRepository.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await UserRepository.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserRepository.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const togglePremium = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserById(req.params.uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role === 'premium' ? 'user' : 'premium';
    await UserRepository.updateUser(user);

    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteInactiveUsers = async (req, res, next) => {
  try {
    const inactivityInterval = 30 * 60 * 1000; // 30 minutos en milisegundos
    const cutoffTime = new Date(Date.now() - inactivityInterval);
    User.find({ lastActive: { $lt: cutoffTime } }, (err, users) => {
      if (err) {
        console.log(err);
      }
      const emails = users.map((user) => user.email);
      sendEmail(emails, 'Your account has been deleted due to inactivity', 'Your account has been deleted due to inactivity');
    });
    User.deleteMany({ lastActive: { $lt: cutoffTime } }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(200).send({ msg: 'Inactive users deleted successfully' });
  } catch (err) {
    res.status(500).send({ msg: 'Error deleting inactive users' });
    next(err);
  }
}
