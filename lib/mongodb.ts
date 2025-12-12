import mongoose, { Connection } from 'mongoose';

/**
 * Global interface to extend NodeJS global type with mongoose connection cache
 * This prevents TypeScript errors when accessing the cached connection
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  } | undefined;
}

/**
 * Cached connection object to store the MongoDB connection and promise
 * This prevents creating multiple connections during development hot-reloads
 */
const cached: {
  conn: Connection | null;
  promise: Promise<Connection> | null;
} = global.mongoose || {
  conn: null,
  promise: null,
};

/**
 * MongoDB connection options
 * These options help optimize the connection for production use
 */
const mongooseOptions: mongoose.ConnectOptions = {
  bufferCommands: false, // Disable mongoose buffering
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

/**
 * Establishes a connection to MongoDB using Mongoose
 * Implements connection caching to prevent multiple connections in development
 *
 * @returns {Promise<Connection>} A promise that resolves to the MongoDB connection
 * @throws {Error} If MONGODB_URI is not defined or connection fails
 */
async function connectDB(): Promise<Connection> {
  // Get MongoDB connection string from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // If we have a cached connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a cached promise, create a new connection
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      ...mongooseOptions,
    };

    // Create the connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear the promise so we can retry
    cached.promise = null;
    throw error;
  }

  // In development, store the cached connection in global object
  // This prevents multiple connections during hot-reloads
  if (process.env.NODE_ENV !== 'production') {
    global.mongoose = cached;
  }

  return cached.conn;
}

export default connectDB;

