import express from 'express';
import * as CartController from '../controllers/CartController.js';
import CartDTO from '../dtos/CartDto.js';
import { isAdmin, isAuthenticated } from '../helpers/accessControl.js';

const router = express.Router();
const toCartDto = (cart) => new CartDTO(cart);

router.get('/', async (req, res, next) => {
  try {
    const cart = await CartController.getCart(req, res, next);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const cart = await CartController.createCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const cart = await CartController.updateCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.delete('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const cart = await CartController.deleteCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/add', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const cart = await CartController.addProductToCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/delete', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const cart = await CartController.deleteProductFromCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

router.post('/clear', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const cart = await CartController.clearCart(req, res, next);
    res.json(toCartDto(cart));
  } catch (err) {
    next(err);
  }
});

export default router;
