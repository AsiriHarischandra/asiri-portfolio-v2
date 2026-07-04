import mongoose from 'mongoose';
import dns from 'node:dns';

// Local-dev DNS workaround. On some machines Node's resolver is set to a dead
// loopback address (dns.getServers() -> 127.0.0.1 with nothing on :53), which
// makes the SRV lookups that `mongodb+srv://` needs fail with ECONNREFUSED.
// Route DNS to public resolvers in development. Production (Vercel) has working
// DNS, so we leave it untouched there.
if (process.env.NODE_ENV !== 'production') {
  try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch { /* ignore */ }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

let cached = globalThis._mongoose || { conn: null, promise: null };
globalThis._mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
