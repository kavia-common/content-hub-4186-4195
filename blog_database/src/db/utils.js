import slugify from 'slugify';

/**
 * PUBLIC_INTERFACE
 * buildSlug
 * Generate a URL-friendly slug from a source text.
 */
export function buildSlug(text) {
  /** Returns a lowercase, hyphenated slug string */
  return slugify(text || '', {
    lower: true,
    strict: true,
    trim: true
  });
}

/**
 * PUBLIC_INTERFACE
 * addTimestamps
 * Adds createdAt/updatedAt options consistently.
 */
export function addTimestamps(schema) {
  schema.set('timestamps', true);
}

/**
 * PUBLIC_INTERFACE
 * addToJSONVirtuals
 * Ensure virtuals are included when converting to JSON.
 */
export function addToJSONVirtuals(schema) {
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
}
