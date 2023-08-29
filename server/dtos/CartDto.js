class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.user = cart.user;
    this.cartItems = cart.cartItems;
    this.total = cart.total;
  }
}

export default CartDTO;