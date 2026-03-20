import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Global error handling middleware
 * Catches all errors and returns consistent error responses
 */
export const errorHandler = (
  error: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error Handler]', error);

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = undefined;

  // Handle APIError
  if (error instanceof APIError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  }
  // Handle MongoDB validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = error.message;
  }
  // Handle MongoDB duplicate key errors
  else if (error.name === 'MongoServerError' && 'code' in error && error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate Entry';
    details = 'This record already exists in the database';
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token';
    details = error.message;
  }
  // Handle generic errors with message
  else if (error instanceof Error) {
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: (error as any).stack }),
    },
  });
};

/**
 * Middleware for handling 404 errors
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new APIError(
    404,
    'Route Not Found',
    `The requested endpoint ${req.method} ${req.path} does not exist`
  );
  next(error);
};

/**
 * Wrapper function to handle async route errors
 * Wraps async route handlers to catch errors
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
