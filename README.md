# asiri-portfolio

Personal portfolio website with a public site and an admin panel.

Built with Next.js 14 (App Router), Tailwind CSS, MongoDB Atlas, and Vercel.

## Quick start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/asiri-portfolio.git
cd asiri-portfolio

# 2. Install
npm install

# 3. Set up env vars
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Seed sample data (optional)
npm run seed

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Architecture

One Next.js app handles everything — public pages (server-rendered), admin panel (client components), and API routes (serverless functions). No separate backend. See `PROJECT_GUIDE.md` for the full architecture and build plan.

## Deployment

Push to `main` → Vercel auto-deploys. Set all env vars in the Vercel dashboard.

## License

MIT
