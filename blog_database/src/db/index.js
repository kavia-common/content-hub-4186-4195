import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PUBLIC_INTERFACE
 * connectDB
 * Establish a connection to MongoDB using environment variables.
 */
export async function connectDB() {
  /**
   * Connects to MongoDB using:
   * - MONGODB_URL: Mongo connection string (no db in path)
   * - MONGODB_DB: Database name
   * Optional tuning:
   * - MONGODB_POOL_SIZE
   * - MONGODB_MIN_POOL_SIZE
   * - MONGODB_MAX_IDLE_TIME_MS
   *
   * Returns the active mongoose connection.
   */
  const {
    MONGODB_URL,
    MONGODB_DB,
    MONGODB_POOL_SIZE,
    MONGODB_MIN_POOL_SIZE,
    MONGODB_MAX_IDLE_TIME_MS,
    NODE_ENV,
  } = process.env;

  if (!MONGODB_URL) {
    throw new Error('Missing MONGODB_URL environment variable. Please set it in .env');
  }
  if (!MONGODB_DB) {
    throw new Error('Missing MONGODB_DB environment variable. Please set it in .env');
  }

  const poolSize = Number(MONGODB_POOL_SIZE || 10);
  const minPoolSize = Number(MONGODB_MIN_POOL_SIZE || 2);
  const maxIdleTimeMS = Number(MONGODB_MAX_IDLE_TIME_MS || 30000);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const fullUri = `${MONGODB_URL}${MONGODB_URL.endsWith('/') ? '' : '/'}${MONGODB_DB}`;
  await mongoose.connect(fullUri, {
    maxPoolSize: poolSize,
    minPoolSize: minPoolSize,
    maxIdleTimeMS,
    serverSelectionTimeoutMS: NODE_ENV === 'development' ? 5000 : 30000
  });

  return mongoose.connection;
}

/**
 * PUBLIC_INTERFACE
 * disconnectDB
 * Gracefully closes the MongoDB connection.
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export default mongoose;
