import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { env } from './config/env';

const app: Application = express();

// Security Middleware
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // Alternative React port
];

if (env.FRONTEND_URL) {
  // Remove trailing slash if user accidentally added one
  const cleanUrl = env.FRONTEND_URL.endsWith('/') 
    ? env.FRONTEND_URL.slice(0, -1) 
    : env.FRONTEND_URL;
  allowedOrigins.push(cleanUrl);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow if it's in the allowed list OR if it's any Vercel deployment URL
    const isAllowedOrigin = allowedOrigins.includes(origin);
    const isVercelPreview = origin.endsWith('.vercel.app');

    if (!isAllowedOrigin && !isVercelPreview) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use('*', notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
