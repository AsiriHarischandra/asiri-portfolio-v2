import mongoose from 'mongoose';
import dns from 'node:dns';

// Local-dev DNS workaround — only applied at runtime, not at import time
if (process.env.NODE_ENV !== 'production') {
  try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch { /* ignore */ }
}

let cached = globalThis._mongoose || { conn: null, promise: null };
globalThis._mongoose = cached;

export async function dbConnect() {
  // Check MONGODB_URI here (runtime), NOT at module level (build time)
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
