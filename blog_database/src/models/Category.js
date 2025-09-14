import mongoose from '../db/index.js';
import { addTimestamps, addToJSONVirtuals, buildSlug } from '../db/utils.js';

const { Schema, models, model } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: 120
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    coverImageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  }
);

addTimestamps(CategorySchema);
addToJSONVirtuals(CategorySchema);

CategorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = buildSlug(this.name);
  }
  next();
});

CategorySchema.index({ slug: 1 }, { unique: true });

/**
 * PUBLIC_INTERFACE
 * Category
 * Category taxonomy for grouping posts.
 */
export const Category = models.Category || model('Category', CategorySchema);

export default Category;
