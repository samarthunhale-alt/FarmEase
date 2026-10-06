import Product from '../models/Product.js';
import { makeListingController } from '../controllers/listingController.js';
import listingRouter from './listingRoutes.js';
import { product } from '../utils/schemas.js';

export default listingRouter(makeListingController(Product, { priceField: 'price', isProduct: true }), product);
