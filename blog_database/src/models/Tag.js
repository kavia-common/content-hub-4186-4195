import mongoose from '../db/index.js';
import { addTimestamps, addToJSONVirtuals, buildSlug } from '../db/utils.js';

const { Schema, models, model } = mongoose;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      unique: true,
      maxlength: 80
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    description: { type: String, maxlength: 300 },
    isActive: { type: Boolean, default: true }
  }
);

addTimestamps(TagSchema);
addToJSONVirtuals(TagSchema);

TagSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = buildSlug(this.name);
  }
  next();
});

TagSchema.index({ slug: 1 }, { unique: true });

/**
 * PUBLIC_INTERFACE
 * Tag
 * Tag taxonomy for posts.
 */
export const Tag = models.Tag || model('Tag', TagSchema);

export default Tag;
