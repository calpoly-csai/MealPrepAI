import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/clerk-sdk-node';

// Initialize Clerk client with backend API
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        [key: string]: any;
      };
    }
  }
}

/**
 * Middleware to verify Clerk Session Tokens
 * Uses Clerk's official SDK for proper RS256 signature verification via JWKS
 * 
 * This is the secure, production-ready approach:
 * - Clerk SDK handles RS256 validation automatically
 * - Verifies token signature using Clerk's JWKS endpoint
 * - Handles token expiration checks
 * - Validates token issuer and audience
 */
export const verifyClerkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    console.log('[AUTH] Verifying token with Clerk...');

    // Use Clerk's SDK to verify the token - handles RS256 validation automatically
    const session = await clerkClient.verifyToken(token);
    
    if (!session?.sub) {
      throw new Error('Invalid token: missing user ID');
    }

    // Fetch complete user data from Clerk for additional security context
    const clerkUser = await clerkClient.users.getUser(session.sub);

    console.log('[AUTH] ✓ Token verified - User:', session.sub);

    // Attach comprehensive user info to request from Clerk
    req.user = {
      userId: session.sub,
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    };

    next();
  } catch (error: any) {
    console.error('[AUTH] Token verification failed:', error.message);

    let statusCode = 401;
    let message = 'Invalid or expired token';

    // Provide specific error messages for debugging (in development only)
    if (error.message?.includes('Token expired')) {
      message = 'Token has expired';
    } else if (error.message?.includes('Invalid token')) {
      message = 'Token is invalid';
    } else if (error.message?.includes('missing user ID')) {
      message = 'Token missing required user information';
    }

    res.status(statusCode).json({ 
      error: message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Middleware to protect routes - requires authenticated user
 * Use after verifyClerkToken middleware
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  next();
};

/**
 * Optional auth middleware - adds user data if authenticated, but doesn't require it
 * Useful for endpoints that can be used by both authenticated and unauthenticated users
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const session = await clerkClient.verifyToken(token);
        
        if (session?.sub) {
          const clerkUser = await clerkClient.users.getUser(session.sub);
          req.user = {
            userId: session.sub,
            email: clerkUser.emailAddresses?.[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
          };
        }
      } catch (error) {
        // Silently continue if token is invalid - this is optional auth
        console.log('[AUTH] Optional auth token verification skipped');
      }
    }

    next();
  } catch (error) {
    // Continue even if optional auth fails
    next();
  }
};

/**
 * Middleware to handle user session management
 * Can be extended to track user sessions in database
 */
export const sessionManagement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user) {
      // TODO: Track user session in database (Phase 2)
      // Example: Create/update user in MongoDB with last activity
      // await User.findByIdAndUpdate(req.user.userId, { 
      //   lastActive: new Date(),
      //   email: req.user.email 
      // }, { upsert: true });
      
      req.user.lastActivity = new Date();
    }

    next();
  } catch (error) {
    console.error('[AUTH] Session management error:', error);
    next(error);
  }
};


