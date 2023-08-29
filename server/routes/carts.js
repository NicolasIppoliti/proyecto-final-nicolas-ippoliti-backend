import express from 'express';
import * as CartController from '../controllers/CartController.js';
import { isAdmin, isAuthenticated } from '../helpers/accessControl.js';

const router = express.Router();
router.get('/:id', CartController.getCart);

router.post('/', async (req, res, next) => {
  try {
    const cart = await CartController.createCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const cart = await CartController.updateCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.delete('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const cart = await CartController.deleteCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.post('/:uid/add/:pid', isAuthenticated, async (req, res, next) => {
  try {
    const cart = await CartController.addProductToCart(req, res, next);
    if (cart) {
      res.json(cart);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/:uid/delete/:pid', isAuthenticated, async (req, res, next) => {
  try {
    const cart = await CartController.deleteProductFromCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/clear', isAuthenticated, async (req, res, next) => {
  try {
    const cart = await CartController.clearCart(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;
