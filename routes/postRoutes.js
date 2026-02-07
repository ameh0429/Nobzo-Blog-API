import express from 'express';
import postController from '../controllers/postController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
  createPostValidation,
  updatePostValidation,
  getPostsValidation,
  getPostBySlugValidation,
  postIdValidation,
} from '../validators/index.js';

const router = express.Router();

// Private (authenticated users)
router.post(
  '/',
  authenticate,
  createPostValidation,
  postController.createPost
);

// Public (with optional auth for filtering drafts)
router.get(
  '/',
  optionalAuth,
  getPostsValidation,
  postController.getPosts
);

// Get a single post by slug
router.get(
  '/:slug',
  optionalAuth,
  getPostBySlugValidation,
  postController.getPostBySlug
);

// Update a post
router.put(
  '/:id',
  authenticate,
  updatePostValidation,
  postController.updatePost
);

// Delete a post (soft delete)
router.delete(
  '/:id',
  authenticate,
  postIdValidation,
  postController.deletePost
);

export default router;