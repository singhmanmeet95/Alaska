import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10, // maximum number of connections in the pool
      minPoolSize: 5, // minimum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // how long to wait for a connection
      socketTimeoutMS: 45000, // how long to wait for socket response
    });
    console.log("Connected to MongoDB with connection pooling enabled");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}
