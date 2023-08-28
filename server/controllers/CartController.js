import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';

export const addProductToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await ProductRepository.getProductById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to premium user
    if (req.user.role === 'premium' && product.ownerId.equals(req.user._id)) {
      return res.status(400).json({ message: 'Premium users cannot add their own products to the cart' });
    }

    // Add product to cart
    const cart = await CartRepository.addProductToCart(req.user._id, productId);
    res.json(cart);

  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.getCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
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
    return res.json({ msg: 'Cart deleted' });
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

export const getCartByUserId = async (req, res, next) => {
  try {
    const cart = await CartRepository.getCartByUserId(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
}

export const purchaseCart = async (req, res, next) => {
  try {
    const cart = await CartRepository.purchaseCart(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    return cart;
  } catch (err) {
    next(err);
  }
}
