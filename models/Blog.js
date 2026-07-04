import mongoose from 'mongoose';
import slugify from 'slugify';

const BlogSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  content:    { type: String, required: true },
  category:   String,
  excerpt:    String,
  coverImage: String,
  mediumUrl:  String,
  published:  { type: Boolean, default: false },
  slug:       { type: String, unique: true },
}, { timestamps: true });

// Auto-generate slug from title before saving
BlogSchema.pre('validate', async function () {
  if (!this.slug || this.isModified('title')) {
    let base = slugify(this.title, { lower: true, strict: true });
    let candidate = base;
    let counter = 1;

    // Ensure uniqueness
    const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
    while (await Blog.findOne({ slug: candidate, _id: { $ne: this._id } })) {
      counter++;
      candidate = `${base}-${counter}`;
    }
    this.slug = candidate;
  }
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
