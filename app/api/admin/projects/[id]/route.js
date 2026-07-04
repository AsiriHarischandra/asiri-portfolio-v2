import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Project from '@/models/Project';
import { validate, projectSchema } from '@/lib/validation';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const data = validate(projectSchema.partial(), body);
    const project = await Project.findByIdAndUpdate(id, data, { new: true });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json(project);
  } catch (err) {
    if (err.status === 400) return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  await Project.findByIdAndDelete(id);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
