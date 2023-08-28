import express from 'express';
import * as OrderController from '../controllers/OrderController.js';
import OrderDTO from '../dtos/OrderDto.js';
import { isAdmin, isAuthenticated } from '../helpers/accessControl.js';

const router = express.Router();
const toOrderDto = (order) => new OrderDTO(order);

router.post('/', isAdmin, isAuthenticated, OrderController.createOrder);

router.get('/:id', isAdmin, isAuthenticated, async (req, res, next) => {
  try {
    const order = await OrderController.getOrderById(req, res, next);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

router.get('/', isAdmin, isAuthenticated, async (req, res, next) => {
  try {
    const orders = await OrderController.getOrders(req, res, next);
    res.json(orders.map((order) => toOrderDto(order)));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', isAdmin, isAuthenticated, async (req, res, next) => {
  try {
    const order = await OrderController.updateOrder(req, res, next);
    res.json(toOrderDto(order));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', isAdmin, isAuthenticated, async (req, res, next) => {
  try {
    const order = await OrderController.deleteOrder(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;
