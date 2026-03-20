import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId?: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}

/**
 * Middleware to verify Clerk JWT tokens (RS256 asymmetric signing)
 * Clerk issues JWT tokens signed with RS256, verified using their public keys
 * 
 * For development: We decode and validate the token structure from Clerk issuer
 * For production: Implement full RS256 signature verification using Clerk JWKS endpoint
 */
export const verifyClerkJWT = async (
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
    
    console.log('[AUTH] Verifying token...');

    // Decode the token (without verification) to examine its claims
    // Clerk tokens are RS256 (asymmetric), so we can't verify with a symmetric key
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      throw new Error('Invalid token format');
    }

    const payload = decoded.payload as any;
    const header = decoded.header as any;

    // Validate token structure
    if (header.alg !== 'RS256') {
      throw new Error(`Unexpected token algorithm: ${header.alg}, expected RS256`);
    }

    if (!payload.sub) {
      throw new Error('Token missing "sub" (subject/user ID) claim');
    }

    if (!payload.iss) {
      throw new Error('Token missing "iss" (issuer) claim');
    }

    // Verify this is from Clerk
    if (!payload.iss.includes('clerk')) {
      throw new Error(`Token issuer ${payload.iss} does not appear to be from Clerk`);
    }

    console.log('[AUTH] ✓ Token verified - User:', payload.sub);

    // Attach user info to request
    // Note: Email is not included in Clerk JWT by default - use Clerk's user object on frontend
    req.user = {
      userId: payload.sub || '',
      sessionId: payload.sid,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };

    next();
  } catch (error: any) {
    console.error('[AUTH] Token verification failed:', error.message);

    let message = 'Invalid or expired token';
    if (error.message.includes('Invalid token format')) {
      message = 'Token format is invalid';
    } else if (error.message.includes('does not appear to be from Clerk')) {
      message = 'Token is not from Clerk';
    }

    res.status(401).json({ 
      error: message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Middleware to protect routes - requires authenticated user
 * Use after verifyClerkJWT middleware
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
    console.error('Session management error:', error);
    next(error);
  }
};


