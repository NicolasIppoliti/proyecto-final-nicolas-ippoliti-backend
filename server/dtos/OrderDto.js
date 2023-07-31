class OrderDTO {
  constructor(order) {
    this.id = order._id;
    this.userId = order.userId;
    this.products = order.products;
    this.totalPrice = order.totalPrice;
  }
}

export default OrderDTO;