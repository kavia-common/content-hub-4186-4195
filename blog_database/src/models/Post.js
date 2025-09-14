import mongoose from '../db/index.js';
import { addTimestamps, addToJSONVirtuals, buildSlug } from '../db/utils.js';

const { Schema, models, model, Types } = mongoose;

export const POST_STATUSES = ['draft', 'published', 'archived', 'scheduled'];

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    excerpt: {
      type: String,
      maxlength: 500
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    coverImageUrl: { type: String, trim: true },

    // Author and ownership
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Taxonomy
    categories: [
      {
        type: Types.ObjectId,
        ref: 'Category',
        index: true
      }
    ],
    tags: [
      {
        type: Types.ObjectId,
        ref: 'Tag',
        index: true
      }
    ],

    // Publishing state
    status: {
      type: String,
      enum: POST_STATUSES,
      default: 'draft',
      index: true
    },
    publishedAt: {
      type: Date,
      index: true
    },
    scheduledAt: {
      type: Date,
      index: true
    },

    // Engagement
    likes: [
      {
        type: Types.ObjectId,
        ref: 'User'
      }
    ],
    views: {
      type: Number,
      default: 0,
      min: 0
    },

    // SEO
    seoTitle: { type: String, maxlength: 70 },
    seoDescription: { type: String, maxlength: 160 },
    seoCanonicalUrl: { type: String, trim: true },

    // Flags
    isFeatured: { type: Boolean, default: false },
    isCommentsEnabled: { type: Boolean, default: true }
  }
);

addTimestamps(PostSchema);
addToJSONVirtuals(PostSchema);

// Indexes for performance and uniqueness
PostSchema.index({ slug: 1 }, { unique: true });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ categories: 1 });
PostSchema.index({ tags: 1 });

// Auto-generate slug from title if not provided
PostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = buildSlug(this.title);
  }
  next();
});

// Ensure publishedAt is set when status transitions to published
PostSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtuals
PostSchema.virtual('likesCount').get(function () {
  return Array.isArray(this.likes) ? this.likes.length : 0;
});

/**
 * PUBLIC_INTERFACE
 * Post
 * Blog posts with publishing workflow, taxonomy, engagement, and SEO fields.
 */
export const Post = models.Post || model('Post', PostSchema);

export default Post;
