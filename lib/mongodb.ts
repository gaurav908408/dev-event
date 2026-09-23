import mongoose, { Mongoose } from "mongoose";

/**
 * Interface defining the structure of the cached Mongoose connection.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the global scope to preserve the Mongoose cache type
 * across hot module reloading (HMR) during Next.js development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Environment variable containing the MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache object used to persist the database connection.
 * In development mode, Next.js clears the Node.js module cache on reloads,
 * so we attach the connection to the `global` object to prevent multiple connections.
 */
let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes and returns a cached connection to MongoDB using Mongoose.
 * 
 * @returns {Promise<Mongoose>} Active Mongoose connection instance.
 */
async function connectToDatabase(): Promise<Mongoose> {
  // Ensure the MongoDB URI is defined
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // Return the existing connection if it is already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, initialize a new connection promise
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and store the resolved connection
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset cached promise on failure so subsequent calls can attempt reconnection
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
