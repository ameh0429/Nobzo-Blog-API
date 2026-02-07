import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.every((tag) => tag.length <= 30);
        },
        message: 'Each tag must be 30 characters or less',
      },
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
postSchema.index({ status: 1, deletedAt: 1, createdAt: -1 });
postSchema.index({ author: 1, status: 1, deletedAt: 1 });
postSchema.index({ tags: 1, status: 1, deletedAt: 1 });

// Text index for search functionality
postSchema.index({ title: 'text', content: 'text' });

// Generate unique slug from title before validation
postSchema.pre('validate', async function (next) {
  if (this.isNew || this.isModified('title')) {
    // Generate base slug
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    let slug = baseSlug;
    let counter = 1;

    // Check for existing slug and make it unique
    while (await mongoose.models.Post.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
//   next();
});

// Default query to exclude soft-deleted posts
postSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty('deletedAt')) {
    this.where({ deletedAt: null });
  }
//   next();
});

// Method to soft delete a post
postSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

// Static method to find including deleted posts
postSchema.statics.findWithDeleted = function (query = {}) {
  return this.find({ ...query, deletedAt: { $ne: null } });
};

const Post = mongoose.model('Post', postSchema);

export default Post;