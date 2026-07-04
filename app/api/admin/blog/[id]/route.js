import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Blog from '@/models/Blog';
import { validate, blogSchema } from '@/lib/validation';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const data = validate(blogSchema.partial(), body);

    // If title changed, update the slug via save() to trigger the pre-validate hook
    const post = await Blog.findById(id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    Object.assign(post, data);
    await post.save();

    revalidatePath('/');
    revalidatePath(`/blog/${post.slug}`, 'page');
    return NextResponse.json(post);
  } catch (err) {
    if (err.status === 400) return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const post = await Blog.findByIdAndDelete(id);
  revalidatePath('/');
  if (post?.slug) revalidatePath(`/blog/${post.slug}`, 'page');
  return NextResponse.json({ success: true });
}
