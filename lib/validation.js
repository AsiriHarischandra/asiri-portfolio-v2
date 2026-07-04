import { z } from 'zod';

// ── Projects ──
export const projectSchema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  tags:        z.array(z.string().max(50)).max(10).default([]),
  thumbnail:   z.string().url().optional().or(z.literal('')),
  githubUrl:   z.string().url().optional().or(z.literal('')),
  demoUrl:     z.string().url().optional().or(z.literal('')),
  featured:    z.boolean().default(false),
  published:   z.boolean().default(true),
  order:       z.number().int().min(0).max(100).default(0),
});

// ── Updates ──
export const updateSchema = z.object({
  type:        z.enum(['progress', 'learning', 'upcoming', 'achievement']),
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  date:        z.string().min(1).max(50),
  active:      z.boolean().default(true),
});

// ── Blog ──
export const blogSchema = z.object({
  title:      z.string().min(1).max(300),
  content:    z.string().min(1).max(50000),
  category:   z.string().max(100).optional().or(z.literal('')),
  excerpt:    z.string().max(500).optional().or(z.literal('')),
  coverImage: z.string().url().optional().or(z.literal('')),
  published:  z.boolean().default(false),
});

// ── Contact ──
export const contactSchema = z.object({
  name:     z.string().min(1).max(200).trim(),
  email:    z.string().email().max(200).trim(),
  subject:  z.string().max(300).optional().or(z.literal('')),
  message:  z.string().min(1).max(5000).trim(),
  honeypot: z.string().max(0).optional(), // must be empty — bot trap
});

// ── Settings ──
export const settingsSchema = z.object({
  name:          z.string().max(200).optional(),
  tagline:       z.string().max(300).optional(),
  university:    z.string().max(200).optional(),
  location:      z.string().max(200).optional(),
  bio:           z.string().max(3000).optional(),
  githubUrl:     z.string().url().optional().or(z.literal('')),
  linkedinUrl:   z.string().url().optional().or(z.literal('')),
  email:         z.string().email().optional().or(z.literal('')),
  avatarUrl:     z.string().url().optional().or(z.literal('')),
  availability:  z.string().max(100).optional(),
});

// ── Login ──
export const loginSchema = z.object({
  password: z.string().min(1).max(200),
});

// Helper: parse and return clean data or throw formatted error
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
    const err = new Error('Invalid input');
    err.status = 400;
    err.details = details;
    throw err;
  }
  return result.data;
}
