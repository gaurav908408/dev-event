import mongoose, { Mongoose } from "mongoose";

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectToDatabase(): Promise<Mongoose> {
  let mongodbUri = process.env.MONGODB_URI?.trim();

  if (mongodbUri) {
    mongodbUri = mongodbUri.replace(/^["']|["']$/g, "").trim();
  }

  if (!mongodbUri) {
    throw new Error(
      "MONGODB_URI environment variable is missing. Please set MONGODB_URI in your Vercel Project Settings (Environment Variables) or .env.local."
    );
  }

  if (!mongodbUri.startsWith("mongodb://") && !mongodbUri.startsWith("mongodb+srv://")) {
    throw new Error(
      'Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://". Please verify your MONGODB_URI.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongodbUri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
