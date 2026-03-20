import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';
import { sessionManagement } from './middleware/auth';
import apiRoutes from './routes/index';

/**
 * Initialize and configure Express application
 */
export function createApp(): Express {
  const app = express();

  // ═══════════════════════════════════════════════════════════════
  // MIDDLEWARE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Session management middleware
  app.use(sessionManagement);

  // ═══════════════════════════════════════════════════════════════
  // ROUTES
  // ═══════════════════════════════════════════════════════════════

  // API routes
  app.use('/api', apiRoutes);

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'MealPrepAI Backend API',
      version: '1.0.0',
      description: 'AI-powered meal planning backend',
      endpoints: {
        health: 'GET /api/health',
        getCurrentUser: 'GET /api/auth/me (requires auth)',
        verifyAuth: 'POST /api/auth/verify (requires auth)',
      },
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════

  // 404 handler - must be after all routes
  app.use(notFoundHandler);

  // Global error handler - must be last
  app.use(errorHandler);

  return app;
}

export default createApp;
