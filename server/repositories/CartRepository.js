import Cart from '../models/Cart.js';
import CartDTO from '../dtos/CartDto.js';
import Order from '../models/Order.js';
import OrderDTO from '../dtos/OrderDto.js';

class CartRepository {

  async getCartByUserId(userId) {
    return await Cart.findOne({ user: userId });
  }

  async createCart(cartData) {
    const cart = new Cart(cartData);
    await cart.save();
    return new CartDTO(cart);
  }

  async addProductToCart(id, productId) {
    const cart = await Cart.findById(id);
    if (!cart) return null;

    const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in the cart, we will just update the quantity
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity += 1;
    } else {
      // We add a new product to the cart
      cart.cartItems.push({ product: productId, quantity: 1 });
    }

    // Update total price
    cart.total = cart.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();

    return new CartDTO(cart);
  }

  async updateCart(id, cartData) {
    const cart = await Cart.findByIdAndUpdate(id, cartData, { new: true });
    return new CartDTO(cart);
  }

  async deleteCart(id) {
    const cart = await Cart.findByIdAndDelete(id);
    return new CartDTO(cart);
  }

  async clearCart(id) {
    const cart = await Cart.findById(id);
    if (!cart) return null;
    
    cart.cartItems = [];
    cart.total = 0;

    await cart.save();

    return new CartDTO(cart);
  }

  async updateProductFromCart(id, productId, quantity) {
    const cart = await Cart.findById(id);
    if (!cart) return null;

    const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in the cart, we update the quantity
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity = quantity;
    } else {
      // Product does not exist in the cart
      return null;
    }

    // Update total price
    cart.total = cart.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();

    return new CartDTO(cart);
  }

  async deleteProductFromCart(id, productId) {
    const cart = await Cart.findById(id);
    if (!cart) return null;

    const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in the cart, we remove it
      cart.cartItems.splice(itemIndex, 1);
    } else {
      // Product does not exist in the cart
      return null;
    }

    // Update total price
    cart.total = cart.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();

    return new CartDTO(cart);
  }

  async purchaseCart(id) {
    const cart = await Cart.findById(id);
    if (!cart) return null;

    const order = new Order({
      user: cart.user,
      orderItems: cart.cartItems,
      totalPrice: cart.total
    });
    await order.save();

    // Clear the cart
    cart.cartItems = [];
    cart.total = 0;
    await cart.save();

    return new OrderDTO(order);
  }
}

export default new CartRepository();
