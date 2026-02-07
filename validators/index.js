import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

/**
 * Middleware to check validation results
 * Throws ValidationError if validation fails
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join('. ');
    throw new ValidationError(errorMessages);
  }

  next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validate,
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),

  validate,
];

/**
 * Validation rules for creating a post
 */
export const createPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),

  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.some((tag) => typeof tag !== 'string' || tag.length > 30)) {
        throw new Error('Each tag must be a string with maximum 30 characters');
      }
      return true;
    }),

  validate,
];

/**
 * Validation rules for updating a post
 */
export const updatePostValidation = [
  param('id').isMongoId().withMessage('Invalid post ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),

  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.some((tag) => typeof tag !== 'string' || tag.length > 30)) {
        throw new Error('Each tag must be a string with maximum 30 characters');
      }
      return true;
    }),

  validate,
];

/**
 * Validation rules for getting posts with filters
 */
export const getPostsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),

  query('search').optional().trim(),

  query('tag').optional().trim(),

  query('author').optional().isMongoId().withMessage('Invalid author ID'),

  validate,
];

/**
 * Validation rules for getting a single post by slug
 */
export const getPostBySlugValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Slug length is invalid'),

  validate,
];

/**
 * Validation rules for post ID parameter
 */
export const postIdValidation = [
  param('id').isMongoId().withMessage('Invalid post ID'),

  validate,
];