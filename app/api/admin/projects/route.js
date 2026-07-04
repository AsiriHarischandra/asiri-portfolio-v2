import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Project from '@/models/Project';
import { validate, projectSchema } from '@/lib/validation';

export async function GET() {
  await dbConnect();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const data = validate(projectSchema, body);
    const project = await Project.create(data);
    revalidatePath('/');
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    if (err.status === 400) {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
