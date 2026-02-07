import postService from '../services/postService.js';

// Create a new post
class PostController {
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.body, req.user._id);

      res.status(201).json({
        status: 'success',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all posts with filters
  async getPosts(req, res, next) {
    try {
      const result = await postService.getPosts(req.query, req.user);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single post by slug
  async getPostBySlug(req, res, next) {
    try {
      const post = await postService.getPostBySlug(req.params.slug, req.user);

      res.status(200).json({
        status: 'success',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a post
  async updatePost(req, res, next) {
    try {
      const post = await postService.updatePost(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        status: 'success',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a post (soft delete)
  async deletePost(req, res, next) {
    try {
      await postService.deletePost(req.params.id, req.user._id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();