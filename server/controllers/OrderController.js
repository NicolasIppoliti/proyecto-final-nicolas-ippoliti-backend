import OrderRepository from '../repositories/OrderRepository.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await OrderRepository.createOrder(req.body);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await OrderRepository.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await OrderRepository.updateOrder(req.params.id, req.body);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await OrderRepository.deleteOrder(req.params.id);
    res.json({ msg: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};
