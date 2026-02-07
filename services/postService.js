import Post from '../models/Post.js';
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
} from '../utils/errors.js';

class PostService {

  // Create a new post
  async createPost(postData, userId) {
    const post = await Post.create({
      ...postData,
      author: userId,
    });

    // Populate author information
    await post.populate('author', 'name email');

    return post;
  }

  // Get posts with filtering, search, and pagination
  async getPosts(filters, user = null) {
    const {
      page = 1,
      limit = 10,
      search,
      tag,
      author,
      status,
    } = filters;

    // Build query
    const query = {};

    // Authorization: Public users can only see published posts
    if (!user) {
      query.status = 'published';
    } else if (status) {
      // Authenticated users can filter by status
      query.status = status;
    }

    // If status is 'draft', only show user's own drafts
    if (query.status === 'draft' && user) {
      query.author = user._id;
    }

    // Search in title and content
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by author
    if (author) {
      // If filtering by author and status is draft, ensure user can only see their own
      if (query.status === 'draft' && user && author !== user._id.toString()) {
        throw new AuthorizationError('You can only view your own draft posts');
      }
      query.author = author;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Post.countDocuments(query),
    ]);

    return {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get a single post by slug
  async getPostBySlug(slug, user = null) {
    const query = { slug };

    // Public users can only see published posts
    if (!user) {
      query.status = 'published';
    }

    const post = await Post.findOne(query).populate('author', 'name email');

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // If post is draft, only author can see it
    if (post.status === 'draft') {
      if (!user || post.author._id.toString() !== user._id.toString()) {
        throw new AuthorizationError('You do not have permission to view this post');
      }
    }

    return post;
  }

  // Update a post
  async updatePost(postId, updateData, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Check authorization
    if (post.author.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only update your own posts');
    }

    // Update post
    Object.assign(post, updateData);
    await post.save();

    // Populate author
    await post.populate('author', 'name email');

    return post;
  }

  // Soft delete a post
  async deletePost(postId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Check authorization
    if (post.author.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only delete your own posts');
    }

    // Soft delete
    await post.softDelete();
  }
}

export default new PostService();