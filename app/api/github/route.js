import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return NextResponse.json([], { status: 200 });
    }

    const headers = { 'User-Agent': 'asiri-portfolio' };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      {
        headers,
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!res.ok) {
      console.error('GitHub API error:', res.status);
      return NextResponse.json([], { status: 200 });
    }

    const repos = await res.json();
    const data = repos.map(r => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      url: r.html_url,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error('GitHub fetch error:', err.message);
    return NextResponse.json([], { status: 200 });
  }
}
