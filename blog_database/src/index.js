import { connectDB } from './db/index.js';
export * from './models/index.js';

/**
 * PUBLIC_INTERFACE
 * initDatabase
 * Initializes and returns an active MongoDB connection. Intended for consumers.
 */
export async function initDatabase() {
  /**
   * Establishes the Mongo database connection and returns it.
   * Consumers (e.g., Express backend) should call this during startup.
   */
  return await connectDB();
}

// If executed directly, just connect and log status (useful for testing inside this container)
if (import.meta && import.meta.url && process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  (async () => {
    try {
      await connectDB();
      // eslint-disable-next-line no-console
      console.log('MongoDB connected successfully');
      process.exit(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    }
  })();
}
