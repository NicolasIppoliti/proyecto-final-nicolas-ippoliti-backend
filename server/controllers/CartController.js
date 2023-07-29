import CartRepository from '../repositories/CartRepository.js';

export const getCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.getCartByUserId(req.user.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.createCart(req.body);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.addProductToCart(req.params.id, req.body.productId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.updateCart(req.params.id, req.body);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.deleteCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.clearCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const updateProductFromCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.updateProductFromCart(req.params.id, req.body.productId, req.body.quantity);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.deleteProductFromCart(req.params.id, req.body.productId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const order = await CartRepository.purchaseCart(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Cart not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
