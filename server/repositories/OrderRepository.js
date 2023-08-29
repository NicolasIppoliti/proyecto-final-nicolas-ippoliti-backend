import Order from '../models/Order.js';
import OrderDTO from '../dtos/OrderDto.js';

class OrderRepository {
  async createOrder(orderData) {
    const order = new Order(orderData);
    await order.save();
    return order;
  }

  async getOrderById(id) {
    return await Order.findById(id);
  }

  async getMyOrders(userId) {
    return await Order.find({ user: userId });
  }

  async getOrders() {
    return await Order.find();
  }

  async updateOrder(id, orderData) {
    const order = await Order.findByIdAndUpdate(id, orderData, { new: true });
    return new OrderDTO(order);
  }

  async deleteOrder(id) {
    await Order.findByIdAndDelete(id);
  }
}

export default new OrderRepository();
