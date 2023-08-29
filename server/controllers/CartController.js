import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import CartDTO from '../dtos/CartDto.js';

const toCartDto = (cart) => new CartDTO(cart);

export const addProductToCart = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error('User not authenticated');
      error.status = 401;
      throw error;
    }

    const productId = req.params.pid;
    const product = await ProductRepository.getProductById(productId);

    // Check if product exists
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    // Check if product belongs to premium user
    if (req.user.role === 'premium' && product.owner.equals(req.user._id)) {
      const error = new Error('Premium users cannot add their own products to the cart');
      error.status = 400;
      throw error;
    }

    // Add product to cart
    const cart = await CartRepository.addProductToCart(req.user.cart, productId);
    if (!cart) {
      const error = new Error('Failed to add product to cart');
      error.status = 500;
      throw error;
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) {
      const error = new Error('Cart not found');
      error.status = 404;
      throw error;
    }
    res.json(toCartDto(cart));
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

export const updateCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.updateCart(req.params.id, req.body);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.deleteCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return res.json({ msg: 'Cart deleted', cartId: req.params.id });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.clearCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
};

export const updateProductFromCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.updateProductFromCart(req.params.id, req.body.productId, req.body.quantity);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.deleteProductFromCart(req.params.id, req.body.productId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.purchaseCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
}
