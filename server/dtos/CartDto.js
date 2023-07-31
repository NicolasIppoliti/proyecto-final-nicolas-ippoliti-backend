class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products;
    this.owner = cart.owner;
    this.totalPrice = cart.totalPrice;
  }
}

export default CartDTO;