class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.description = product.description;
    this.code = product.code;
    this.category = product.category;
    this.price = product.price;
    this.status = product.status;
    this.countInStock = product.countInStock;
    this.imageUrl = product.imageUrl;
    this.owner = product.owner;
  }
}

export default ProductDTO;
