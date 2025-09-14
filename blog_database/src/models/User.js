import mongoose from '../db/index.js';
import validator from 'validator';
import { addTimestamps, addToJSONVirtuals } from '../db/utils.js';

const { Schema, models, model } = mongoose;

/**
 * Roles available for users. Admins can manage content.
 */
export const USER_ROLES = ['admin', 'author', 'user'];

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      maxlength: 60
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Invalid email'
      }
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
      index: true
    },
    avatarUrl: { type: String, trim: true },
    bio: { type: String, maxlength: 1000 },
    social: {
      twitter: { type: String, trim: true },
      github: { type: String, trim: true },
      website: { type: String, trim: true }
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date }
  }
);

addTimestamps(UserSchema);
addToJSONVirtuals(UserSchema);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true, sparse: true });

/**
 * PUBLIC_INTERFACE
 * User
 * The User model storing authentication info and author/admin profiles.
 */
export const User = models.User || model('User', UserSchema);

export default User;
