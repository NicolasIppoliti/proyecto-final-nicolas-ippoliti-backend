import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import ProductDTO from '../dtos/ProductDto.js';
import passport from 'passport';

const router = express.Router();
const toProductDto = (product) => new ProductDTO(product);

router.post('/', passport.authenticate('jwt', {session: false}), ProductController.createProduct);

router.get('/', async (req, res, next) => {
  try {
    const products = await ProductController.getProducts(req, res, next);
    res.json(products.map(toProductDto));
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

router.put('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const product = await ProductController.updateProduct(req, res, next);
    res.json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const product = await ProductController.deleteProduct(req, res, next);
    res.json(toProductDto(product));
  } catch (err) {
    next(err);
  }
});

export default router;
