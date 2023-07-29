import express from 'express';
import * as CartController from '../controllers/CartController.js';
import CartDTO from '../dtos/CartDto.js';
import passport from 'passport';

const router = express.Router();
const toCartDto = (cart) => new CartDTO(cart);

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.getCart(req, res, next);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.createCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.put('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.updateCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.delete('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.deleteCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/add', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.addProductToCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/delete', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.deleteProductFromCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/clear', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const cart = await CartController.clearCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

export default router;
