import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  tags:        [String],
  thumbnail:   String,
  githubUrl:   String,
  demoUrl:     String,
  featured:    { type: Boolean, default: false },
  published:   { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
