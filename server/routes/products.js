import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import ProductDTO from '../dtos/ProductDto.js';
import { isAuthenticated, isProductOwner } from '../helpers/accessControl.js';
import Mailer from '../mail/mailer.js';

const router = express.Router();
const toProductDto = (product) => new ProductDTO(product);
const mailer = new Mailer();

router.post('/', isProductOwner, isAuthenticated, ProductController.createProduct);

router.get('/', async (req, res, next) => {
  try {
    const products = await ProductController.getProducts(req, res, next);
    res.json(products.map((product) => toProductDto(product)));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await ProductController.getProductById(req, res, next);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', isProductOwner, isAuthenticated, async (req, res, next) => {
  try {
    const product = await ProductController.updateProduct(req, res, next);
    res.json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', isProductOwner, isAuthenticated, async (req, res, next) => {
  try {
    const productOwner = await ProductController.getProductOwner(req, res, next);
    mailer.sendEmail(productOwner.email, 'Product deleted', 'Your product has been deleted');
    const product = await ProductController.deleteProduct(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;
