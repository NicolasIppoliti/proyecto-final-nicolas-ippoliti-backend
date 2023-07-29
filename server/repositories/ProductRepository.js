import Product from '../models/Product.js';
import ProductDTO from '../dtos/ProductDto.js';

class ProductRepository {
  async createProduct(productData) {
    const product = new Product(productData);
    await product.save();
    return product;
  }

  async getProducts() {
    return await Product.find();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, productData) {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    return new ProductDTO(product);
  }

  async deleteProduct(id) {
    await Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();
