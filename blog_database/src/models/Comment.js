import mongoose from '../db/index.js';
import { addTimestamps, addToJSONVirtuals } from '../db/utils.js';

const { Schema, models, model, Types } = mongoose;

const CommentSchema = new Schema(
  {
    post: {
      type: Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: 5000,
      trim: true
    },
    parent: {
      type: Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    // Simple like/upvote structure: unique user ids
    likes: [
      {
        type: Types.ObjectId,
        ref: 'User'
      }
    ],
    // Moderation
    isApproved: {
      type: Boolean,
      default: true
    }
  }
);

addTimestamps(CommentSchema);
addToJSONVirtuals(CommentSchema);

// Virtual for replies count
CommentSchema.virtual('repliesCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  count: true
});

/**
 * PUBLIC_INTERFACE
 * Comment
 * Comments for posts with threaded replies (via parent) and likes.
 */
export const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
