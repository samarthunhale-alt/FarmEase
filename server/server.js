import express from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://farm-ease-eis2tu7el-samarthunhale-alts-projects.vercel.app',
  'https://farm-ease-2855tsybl-samarthunhale-alts-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ⬇️ तुझे existing routes इथेच राहू दे
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// इत्यादी...

app.get('/', (req, res) => {
  res.json({ message: 'Farmer API is running' });
});

// ⬇️ तुझा existing error handler इथे राहू दे

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});