import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'portfolio' },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName:  process.env.CLOUDINARY_CLOUD_NAME,
      apiKey:     process.env.CLOUDINARY_API_KEY,
      folder:     'portfolio',
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
