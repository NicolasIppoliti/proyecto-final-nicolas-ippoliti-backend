import ProductRepository from '../repositories/ProductRepository.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductRepository.createProduct(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await ProductRepository.getProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductRepository.getProductById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductRepository.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await ProductRepository.deleteProduct(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

export const getProductOwner = async (req, res, next) => {
  try {
    const product = await ProductRepository.getProductById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    return product.owner;
  } catch (err) {
    next(err);
  }
}