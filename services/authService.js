import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import {
  AuthenticationError,
  ConflictError,
  ValidationError,
} from '../utils/errors.js';

class AuthService {

  // Register a new user
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  // Login user
  async login({ email, password }) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}

export default new AuthService();