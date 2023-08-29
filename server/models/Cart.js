import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false,
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    default: 0,
  }
});

const Cart = mongoose.model('carts', CartSchema);

export default Cart;
