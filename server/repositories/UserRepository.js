import User from '../models/User.js';
import bcrypt from 'bcrypt';

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async getUsers() {
    return await User.find();
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData, { new: true });
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

export default new UserRepository();
