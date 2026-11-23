import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  // Always a single document — use a fixed key to find/upsert it
  _id:   { type: String, default: 'global' },
  count: { type: Number, default: 0 },
}, { _id: false });

export default mongoose.models.Visitor ||
  mongoose.model('Visitor', VisitorSchema);
