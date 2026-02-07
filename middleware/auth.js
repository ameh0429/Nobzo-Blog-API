import { verifyToken } from '../utils/jwt.js';
import { AuthenticationError } from '../utils/errors.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes requiring authentication
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid token' || error.message === 'Token has expired') {
      next(new AuthenticationError(error.message));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to optionally authenticate user
 * Doesn't fail if no token, but attaches user if valid token exists
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    next();
  }
};