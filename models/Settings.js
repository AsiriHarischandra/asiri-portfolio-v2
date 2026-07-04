import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  name:         { type: String, default: 'Asiri Harischandra' },
  tagline:      { type: String, default: 'Never Give Up' },
  university:   { type: String, default: 'University of Moratuwa' },
  location:     { type: String, default: 'Moratuwa, Sri Lanka' },
  bio:          { type: String, default: '' },
  githubUrl:    { type: String, default: '' },
  linkedinUrl:  { type: String, default: '' },
  email:        { type: String, default: '' },
  avatarUrl:    { type: String, default: '' },
  avatarBadge:  { type: String, default: 'UoM · CS' },
  availability: { type: String, default: 'open to internships' },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
