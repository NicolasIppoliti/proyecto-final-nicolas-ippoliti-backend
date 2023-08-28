class OrderDTO {
  constructor(order) {
    this.id = order._id;
    this.user = order.user;
    this.orderItems = order.orderItems;
    this.orderItems.forEach((item) => {
      item.product = item.product._id;
      item.quantity = item.product.quantity;
    });
    this.totalPrice = order.totalPrice;
  }
}

export default OrderDTO;