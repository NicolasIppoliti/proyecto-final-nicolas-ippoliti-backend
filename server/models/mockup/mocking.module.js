import { faker } from '@faker-js/faker';
import UserRepository from '../../repositories/UserRepository.js';
import ProductRepository from '../../repositories/ProductRepository.js';
import CartRepository from '../../repositories/CartRepository.js';
import OrderRepository from '../../repositories/OrderRepository.js';
import logger from '../../config/winston.js';

export const generateMockData = async () => {
  // Generate mock users
  for (let i = 0; i < 10; i++) {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'user',
      cart: null,
    };
    await UserRepository.createUser(user);
  }

  // Generate mock products
  for (let i = 0; i < 50; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      code: faker.string.uuid(),
      category: faker.commerce.department(),
      price: faker.commerce.price(),
      status: true,
      countInStock: faker.number.int(),
      imageUrl: faker.image.url(),
    };
    await ProductRepository.createProduct(product);
  }

  // Generate mock carts
  const users = await UserRepository.getUsers();
  const products = await ProductRepository.getProducts();
  for (let i = 0; i < 10; i++) {
    const cart = {
      user: users[i]._id,
      products: [
        {
          product: products[i]._id,
          quantity: faker.number.int(),
        },
      ],
      total: faker.commerce.price(),
    };
    await CartRepository.createCart(cart);
  }

  // Generate mock orders
  for (let i = 0; i < 10; i++) {
    const order = {
      user: users[i]._id,
      products: [
        {
          product: products[i]._id,
          quantity: faker.number.int(),
        },
      ],
      totalPrice: faker.commerce.price(),
      shippingAddress: faker.location.streetAddress(),
      shippingPrice: faker.commerce.price(),
      taxPrice: faker.commerce.price(),
      paymentMethod: 'PayPal',
      paymentResult: {
        id: faker.string.uuid(),
        status: 'COMPLETED',
        update_time: faker.date.recent(),
        email_address: faker.internet.email(),
      },
      isPaid: true,
      paidAt: faker.date.recent(),
      isDelivered: true,
      deliveredAt: faker.date.recent(),
    };
    await OrderRepository.createOrder(order);
  }

  logger.info('Mock data generated');
};

export default generateMockData;
