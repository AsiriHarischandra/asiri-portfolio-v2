import mongoose from 'mongoose';

const UpdateSchema = new mongoose.Schema({
  type:        { type: String, enum: ['progress', 'learning', 'upcoming', 'achievement'], required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: String, required: true },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Update || mongoose.model('Update', UpdateSchema);
