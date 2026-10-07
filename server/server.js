import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cropInfoRoutes from './routes/cropInfoRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Security and logging
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

app.use(morgan('dev'));

// =========================
// CORS
// =========================

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://farm-ease-neon.vercel.app',
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  // Exact allowed origins
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Local development
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return true;
  }

  // FarmEase Vercel deployments
  if (/^https:\/\/farm-ease-[a-z0-9-]+\.vercel\.app$/.test(origin)) {
    return true;
  }

  // FarmEase Vercel project preview URLs
  if (
    /^https:\/\/farm-ease-[a-z0-9-]+-samarthunhale-alts-projects\.vercel\.app$/.test(
      origin
    )
  ) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

// Rate limit
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json());

// Uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Farmer API is running',
  });
});

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/crop-info', cropInfoRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

// Start server
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGODB_URI is missing in .env');
    }

    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    const server = app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Stop the old server (Ctrl+C) and run again.`
        );

        process.exit(1);
      } else {
        throw err;
      }
    });

    const shutdown = () => {
      console.log('Shutting down...');

      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
};

startServer();