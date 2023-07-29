class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.userId = cart.userId;
    this.products = cart.products;
    this.totalPrice = cart.totalPrice;
  }
}

export default CartDTO;