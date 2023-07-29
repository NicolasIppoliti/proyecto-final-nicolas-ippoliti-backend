class OrderDTO {
  constructor(order) {
    this.id = order._id;
    this.userId = order.userId;
    this.products = order.products;
    this.totalPrice = order.totalPrice;
    this.status = order.status;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }
}

export default OrderDTO;