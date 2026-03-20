import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyClerkToken, requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * Health check endpoint - no authentication required
 */
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'MealPrepAI Backend is running',
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Auth info endpoint - shows Clerk configuration status
 * GET /api/auth/info
 */
router.get('/auth/info', asyncHandler(async (req: Request, res: Response) => {
  const hasSecretKey = !!process.env.CLERK_SECRET_KEY;
  
  res.json({
    success: true,
    message: 'MealPrepAI Authentication Service',
    authProvider: 'Clerk',
    clerkConfigured: hasSecretKey,
    environment: process.env.NODE_ENV || 'development',
    instructions: {
      step1: 'Sign up at https://clerk.com',
      step2: 'Get your CLERK_SECRET_KEY from the Clerk dashboard',
      step3: 'Set it in your .env file',
      step4: 'Users sign in via your mobile app (Clerk handles this)',
      step5: 'Mobile app sends token to backend in Authorization header',
      step6: 'Backend verifies token using Clerk SDK',
    },
    tokenFormat: 'Authorization: Bearer <clerk_jwt_token>',
    clerkDocsUrl: 'https://clerk.com/docs/reference/backend-api',
  });
}));

/**
 * Protected route - Get current user info from Clerk
 * GET /api/auth/me
 * Requires: Authorization: Bearer <clerk_token>
 * 
 * This endpoint uses Clerk's backend API to fetch complete user information,
 * ensuring you always have the most up-to-date user data
 */
router.get(
  '/auth/me',
  verifyClerkToken,
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      user: {
        userId: req.user?.userId,
        email: req.user?.email,
        firstName: req.user?.firstName,
        lastName: req.user?.lastName,
        lastActivity: req.user?.lastActivity,
        authenticatedWith: 'Clerk SDK (Secure)',
      },
    });
  })
);

/**
 * Verification endpoint - test Clerk token validation
 * POST /api/auth/verify
 * Requires: Authorization: Bearer <clerk_token>
 * 
 * This endpoint verifies the token is valid and authenticated with Clerk
 */
router.post(
  '/auth/verify',
  verifyClerkToken,
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Authentication verified with Clerk SDK',
      user: {
        userId: req.user?.userId,
        email: req.user?.email,
      },
      tokenValid: true,
    });
  })
);

export default router;
