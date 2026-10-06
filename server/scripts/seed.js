import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import CropInfo from '../models/CropInfo.js';
import User from '../models/User.js';

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const categories = [
  ['Grains & Cereals', 'Wheat, rice, maize, millets'],
  ['Pulses', 'Lentils, chickpea, pigeon pea, gram'],
  ['Vegetables', 'Fresh seasonal vegetables'],
  ['Fruits', 'Fresh seasonal fruits'],
  ['Oilseeds', 'Soybean, groundnut, mustard, sunflower'],
  ['Spices', 'Whole and ground spices'],
  ['Cash Crops', 'Sugarcane, cotton and similar crops'],
  ['Dairy & Others', 'Milk products, honey and other farm produce'],
].map(([name, description]) => ({ name, description, slug: slugify(name) }));

const NOTE_F =
  'Rates and timing vary by variety, soil and region. Follow a soil test and local agriculture department advice.';

const crops = [
  [
    'Wheat',
    ['Rabi'],
    ['Loam', 'Clay loam'],
    'Usually sown in the cooler months after the monsoon and harvested in spring. A fine, level seed bed helps even germination.',
    'Needs irrigation at a few key growth stages when rainfall is low; the number depends on soil, variety and weather.',
  ],
  [
    'Rice (Paddy)',
    ['Kharif'],
    ['Clay', 'Clay loam'],
    'Commonly grown in the monsoon season, either transplanted from a nursery or direct seeded. Fields that hold water suit it well.',
    'Often grown with standing water for much of the season, or rainfed where irrigation is limited. Water management differs between systems.',
  ],
  [
    'Maize',
    ['Kharif', 'Rabi'],
    ['Well-drained loam', 'Sandy loam'],
    'Grown in the monsoon season and, in some regions, in the cooler season too. Choose a variety suited to your area.',
    'Sensitive to waterlogging. Needs moisture especially around flowering, so avoid long dry spells.',
  ],
  [
    'Soybean',
    ['Kharif'],
    ['Well-drained loam', 'Clay loam'],
    'Typically sown with the onset of monsoon rains. Good drainage and quality seed matter for a healthy stand.',
    'Mostly rainfed. Provide protective irrigation during long dry periods if water is available.',
  ],
  [
    'Cotton',
    ['Kharif'],
    ['Deep black soil', 'Well-drained loam'],
    'A long-duration crop sown before or at the start of the monsoon, depending on region. Spacing and variety depend on local recommendations.',
    'Needs steady moisture during growth and flowering; avoid waterlogging.',
  ],
  [
    'Sugarcane',
    ['Year-round planting windows vary by region'],
    ['Deep loam', 'Clay loam'],
    'A long-duration crop that stays in the field for many months. Healthy planting material and good land preparation are important.',
    'Needs regular irrigation through the growing period, with schedules depending on soil and climate.',
  ],
  [
    'Tomato',
    ['Rabi', 'Kharif', 'Zaid'],
    ['Well-drained sandy loam', 'Loam'],
    'Usually raised in a nursery and transplanted. Suitable sowing time depends on local temperature and variety. Staking can improve fruit quality.',
    'Prefers regular, light irrigation. Uneven watering can affect fruit quality.',
  ],
  [
    'Onion',
    ['Rabi', 'Kharif'],
    ['Well-drained loam', 'Sandy loam'],
    'Grown from a nursery transplanted into prepared beds. Variety choice depends on the season and region.',
    'Light, frequent irrigation suits it. Irrigation is generally reduced as bulbs mature, before harvest.',
  ],
].map(([name, seasons, soilTypes, cultivation, irrigation]) => ({
  name,
  seasons,
  soilTypes,
  cultivation,
  irrigation,
  fertilizer: `Nitrogen, phosphorus and potassium are the main nutrients for most crops. ${NOTE_F}`,
}));

try {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);

  // updateOne skips model hooks, so the slug is set explicitly here.
  for (const c of categories) {
    await Category.updateOne(
      { name: c.name },
      { $set: { slug: c.slug }, $setOnInsert: { description: c.description, isActive: true } },
      { upsert: true }
    );
  }

  for (const c of crops) {
    await CropInfo.updateOne({ name: c.name }, { $setOnInsert: c }, { upsert: true });
  }

  const { ADMIN_NAME = 'Platform Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    if (!(await User.exists({ email: ADMIN_EMAIL.toLowerCase() }))) {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`Admin created: ${ADMIN_EMAIL}`);
    } else {
      console.log('Admin already exists');
    }
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set: skipped admin creation');
  }

  console.log('Seed complete');
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}