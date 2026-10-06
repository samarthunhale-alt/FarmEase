import Crop from '../models/Crop.js';
import { makeListingController } from '../controllers/listingController.js';
import listingRouter from './listingRoutes.js';
import { crop } from '../utils/schemas.js';

export default listingRouter(makeListingController(Crop, { priceField: 'expectedPrice', isProduct: false }), crop);
