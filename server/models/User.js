import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user',
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('users', UserSchema);

export default User;
