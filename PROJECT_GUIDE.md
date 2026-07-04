# Asiri Portfolio — Master Project Guide

> **Purpose of this file:** This is the single source of truth for the project. Any AI agent (Claude Code, Cursor, etc.) or human developer working on this project MUST read this file first and stay aligned with it. If a decision is not covered here, follow the "Decision Rules" in Section 12, then update this file.

**Owner:** Asiri Harischandra · University of Moratuwa · Sri Lanka
**Repo:** `asiri-portfolio`
**Status legend used in checklists:** `[ ]` todo · `[x]` done

---

## 1. Project Goal (one paragraph)

Build a personal portfolio website with a public site (hero, about, education, projects, live updates, tech stack, blog, contact) and a private admin panel where the owner manages ALL content through forms — never by editing code. Hosting cost must be $0/month. The site must be fast (< 2s first load), SEO-friendly, mobile responsive, and secure.

---

## 2. Non-Negotiable Requirements (acceptance criteria)

The project is DONE only when every item below passes:

### Public site
- [ ] Hero: name, animated typewriter role, tagline, location, social links, hexagonal avatar
- [ ] About: bio, skill bars, interest chips, value cards
- [ ] Education: vertical timeline (diploma + BSc) with glowing green nodes
- [ ] Projects: cards with image, title, description, tech tags, GitHub + Demo buttons — data from DB
- [ ] Live Updates feed: cards typed as In Progress / Learning / Upcoming / Achievement — data from DB
- [ ] Tech Stack: categorized pills (Frontend, Backend, AI/Data, DevOps)
- [ ] Blog: post cards (category, title, excerpt) + individual post pages at `/blog/[slug]`
- [ ] Contact: form (name, email, subject, message) that emails the owner AND saves to DB
- [ ] Animated circuit/particle background with mouse interaction
- [ ] Scroll-reveal animations on every section
- [ ] Mobile responsive on all screen sizes
- [ ] First contentful paint under 2 seconds on 4G (pages are server-rendered, no client loading spinners for content)
- [ ] SEO: metadata, Open Graph tags, sitemap.xml, robots.txt, 404 page

### Admin panel (`/admin`)
- [ ] Login with password → httpOnly cookie session (JWT)
- [ ] Dashboard with live stats (projects count, unread messages, updates count, last GitHub sync)
- [ ] Projects tab: add / edit / delete / reorder / publish toggle
- [ ] Updates tab: add / edit / delete typed update cards
- [ ] Blog tab: markdown editor, publish/draft toggle, auto-generated slug
- [ ] Messages tab: list contact submissions, mark as read
- [ ] Settings tab: name, tagline, university, location, bio, social URLs
- [ ] Any admin save is visible on the public site within 60 seconds (use `revalidatePath`)

### Automation & ops
- [ ] Contact form submission → email arrives in owner's inbox
- [ ] GitHub repos auto-appear on the site (cached ≤ 1 hour, authenticated API)
- [ ] `git push` to `main` → CI checks → Vercel auto-deploy
- [ ] Total hosting cost: $0/month

---

## 3. Architecture (decided — do NOT change without updating this file)

### 3.1 The one-app rule

**ONE Next.js app deployed on Vercel. There is NO separate Express backend. There is NO Render.com.**

Reasoning (recorded so future agents do not "fix" this backwards):
1. Render free tier cold-starts ~30s → breaks the <2s load requirement.
2. Next.js Route Handlers replace Express 1:1 with zero extra hosting.
3. One repo, one deploy, no CORS, no cross-service env drift.

### 3.2 System diagram (text form)

```
Visitors ──► Vercel (Next.js app)
You/admin ──►   ├── Public pages  → React Server Components + ISR (revalidate: 60)
                ├── Admin panel   → client components behind middleware auth
                └── API routes    → app/api/**/route.js (serverless functions)
                        │
                        ├── MongoDB Atlas (M0 free) — all content data
                        ├── Cloudinary — image storage (signed uploads)
                        ├── GitHub REST API — repo sync (token + 1h cache)
                        └── Resend — transactional email (contact form)
```

### 3.3 Rendering strategy

| Page | Strategy |
|---|---|
| `/` (all public sections) | Server Components, fetch from DB directly, `export const revalidate = 60` |
| `/blog/[slug]` | Server Component + `generateStaticParams`, revalidate 60 |
| `/admin`, `/admin/dashboard` | Client components (`'use client'`), `dynamic = 'force-dynamic'` |
| API routes | Serverless route handlers |

**Rule:** Public content components NEVER use `useEffect` + client fetch for initial data. Server-fetch and pass down as props. Client interactivity (forms, animations) lives in small leaf client components.

### 3.4 Tech stack (locked)

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router, JavaScript, no TypeScript) | |
| Styling | Tailwind CSS | theme tokens in Section 8 |
| DB | MongoDB Atlas M0 + Mongoose | cached connection (Section 5.1) |
| Validation | zod | every write path |
| Auth | bcryptjs + jose (JWT) + httpOnly cookie | Section 6 |
| Email | Resend (fallback: Nodemailer + Gmail app password) | |
| Images | Cloudinary signed uploads | |
| Icons | lucide-react | |
| Markdown | @uiw/react-md-editor (admin) + react-markdown (render) | |
| Hosting | Vercel free tier | |
| CI | GitHub Actions: lint + build on PR | |

---

## 4. Folder Structure (create exactly this)

```
asiri-portfolio/
├── app/
│   ├── layout.jsx                  # fonts (Syne, DM Sans, DM Mono), metadata, bg
│   ├── page.jsx                    # home — imports all section components (server)
│   ├── globals.css
│   ├── not-found.jsx               # 404 page
│   ├── sitemap.js                  # generates sitemap.xml
│   ├── robots.js                   # generates robots.txt
│   ├── blog/[slug]/page.jsx        # blog post page (server, ISR)
│   ├── admin/
│   │   ├── page.jsx                # login (client)
│   │   └── dashboard/page.jsx      # dashboard shell + tabs (client)
│   └── api/
│       ├── contact/route.js        # POST — validate, save, email, rate limit
│       ├── github/route.js         # GET — cached repo list
│       ├── upload-signature/route.js # GET (admin-only) — Cloudinary signature
│       └── admin/
│           ├── login/route.js      # POST — bcrypt compare, set cookie
│           ├── logout/route.js     # POST — clear cookie
│           ├── projects/route.js           # GET, POST
│           ├── projects/[id]/route.js      # PUT, DELETE
│           ├── updates/route.js            # GET, POST
│           ├── updates/[id]/route.js       # PUT, DELETE
│           ├── blog/route.js               # GET, POST
│           ├── blog/[id]/route.js          # PUT, DELETE
│           ├── messages/route.js           # GET
│           ├── messages/[id]/route.js      # PUT (mark read), DELETE
│           └── settings/route.js           # GET, PUT
├── components/
│   ├── layout/   Navbar.jsx · Footer.jsx
│   ├── sections/ Hero.jsx · About.jsx · Education.jsx · Projects.jsx ·
│   │             Updates.jsx · TechStack.jsx · Blog.jsx · Contact.jsx
│   ├── ui/       ParticleCanvas.jsx · ProjectCard.jsx · UpdateCard.jsx ·
│   │             BlogCard.jsx · SkillBar.jsx · Reveal.jsx
│   └── admin/    ProjectsPanel.jsx · UpdatesPanel.jsx · BlogPanel.jsx ·
│                 MessagesPanel.jsx · SettingsPanel.jsx
├── lib/
│   ├── db.js                       # cached Mongoose connection
│   ├── auth.js                     # JWT sign/verify helpers (jose)
│   ├── validation.js               # all zod schemas
│   ├── rateLimit.js                # simple in-memory limiter
│   ├── email.js                    # Resend wrapper, escapes HTML
│   └── data.js                     # server-side data fetchers used by pages
├── models/
│   ├── Project.js · Update.js · Blog.js · Message.js · Settings.js
├── middleware.js                   # protects /admin/dashboard + /api/admin/*
├── .github/workflows/ci.yml
├── .env.local                      # NEVER commit
├── .gitignore
├── tailwind.config.js
├── next.config.js
└── PROJECT_GUIDE.md                # this file — keep in repo root
```

---

## 5. Data Layer

### 5.1 Cached DB connection (mandatory pattern for serverless)

`lib/db.js` must cache the Mongoose connection on `globalThis` so hot serverless invocations reuse it:

```js
import mongoose from 'mongoose';
let cached = globalThis._mongoose || { conn: null, promise: null };
globalThis._mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(process.env.MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}
```

Every route handler and server data fetcher calls `await dbConnect()` first.

### 5.2 Models (fields locked — extend only additively)

**Project:** `title*`, `description*`, `tags[]`, `thumbnail` (Cloudinary URL), `githubUrl`, `demoUrl`, `featured:false`, `published:true`, `order:0`, timestamps.

**Update:** `type*` ∈ `progress|learning|upcoming|achievement`, `title*`, `description*`, `date*` (display string e.g. "Jun 2025"), `active:true`, timestamps.

**Blog:** `title*`, `content*` (markdown), `category`, `excerpt`, `coverImage`, `published:false`, `slug` (unique, **auto-generated** — see rule below), timestamps.

**Message:** `name*`, `email*`, `subject`, `message*`, `read:false`, timestamps.

**Settings:** singleton document — `name`, `tagline`, `university`, `location`, `bio`, `githubUrl`, `linkedinUrl`, `email`. Hero stats (projects count etc.) are **computed from real data**, never stored as manual counters.

**Slug rule:** on Blog create, `slug = slugify(title)`; if it already exists, append `-2`, `-3`, ... Never trust a client-supplied slug blindly — validate it matches `/^[a-z0-9-]+$/`.

### 5.3 Validation rule

Every `POST`/`PUT` body is parsed with a zod schema from `lib/validation.js` before touching Mongoose. On failure return `400` with `{ error: 'Invalid input', details }`. **Never** pass `req.body` (or `await req.json()`) directly into `Model.create()` / `findByIdAndUpdate()` — this is a mass-assignment vulnerability.

---

## 6. Auth & Security (hard rules — an agent must never weaken these)

1. **Password:** store `ADMIN_PASSWORD_HASH` (bcrypt, cost 12) in env. Login compares with `bcrypt.compare()`. Never store or compare plain text.
2. **Session:** on successful login, sign a JWT (`jose`, HS256, `JWT_SECRET`, 7-day expiry) and set it as a cookie: `httpOnly: true, secure: true (prod), sameSite: 'lax', path: '/'`. **Never** put the token in `localStorage`.
3. **Route protection:** `middleware.js` matcher covers `/admin/dashboard/:path*` and `/api/admin/:path*` (everything except `/api/admin/login`). Invalid/missing token → redirect to `/admin` (pages) or `401` (API). Client-side checks are UX only, never the security boundary.
4. **Login rate limit:** max 5 attempts per IP per 15 minutes (in-memory limiter is acceptable at this scale). Return `429` after.
5. **Contact form:** zod-validate, rate limit (3/hour/IP), hidden honeypot field (silently drop if filled), and **HTML-escape** all user text before embedding in the email body.
6. **Secrets:** only in `.env.local` (local) and Vercel env settings (prod). `.gitignore` must include `.env*`. If a secret ever lands in a commit, rotate it — do not just delete the file.
7. **Cloudinary:** browser uploads use a **signed** signature from `/api/upload-signature` (admin-only route). Never expose `CLOUDINARY_API_SECRET` to the client.
8. **GitHub sync:** call GitHub with `GITHUB_TOKEN` (read-only, public repos scope) and cache with `fetch(url, { next: { revalidate: 3600 } })`. Do not use module-level in-memory caches for this — they die on cold start.
9. **No security by obscurity:** `/admin` being "unlinked" is not protection. Auth is.

---

## 7. API Contract

All responses are JSON. Errors: `{ error: string }` with proper status codes (400 validation, 401 auth, 404 not found, 429 rate limited, 500 server).

### Public
| Method | Path | Behavior |
|---|---|---|
| POST | `/api/contact` | validate → save Message → send email → `{ success: true }` |
| GET | `/api/github` | `[{ name, description, language, stars, url, updatedAt }]`, top 6 by updated |

(Public page data — projects, updates, blog, settings — is fetched **server-side** in `lib/data.js`, not through public API routes.)

### Admin (cookie-authenticated, enforced by middleware)
| Method | Path | Behavior |
|---|---|---|
| POST | `/api/admin/login` | `{ password }` → set cookie |
| POST | `/api/admin/logout` | clear cookie |
| GET/POST | `/api/admin/projects` | list all / create |
| PUT/DELETE | `/api/admin/projects/[id]` | update / delete |
| GET/POST | `/api/admin/updates` | list all / create |
| PUT/DELETE | `/api/admin/updates/[id]` | update / delete |
| GET/POST | `/api/admin/blog` | list all / create (auto-slug) |
| PUT/DELETE | `/api/admin/blog/[id]` | update / delete |
| GET | `/api/admin/messages` | list newest first |
| PUT/DELETE | `/api/admin/messages/[id]` | mark read / delete |
| GET/PUT | `/api/admin/settings` | get-or-create singleton / update |
| GET | `/api/upload-signature` | Cloudinary signed upload params |

**Revalidation rule:** every successful admin mutation calls `revalidatePath('/')` (and `revalidatePath('/blog/[slug]', 'page')` for blog changes) so the public site refreshes instantly.

---

## 8. Design System (locked tokens)

```js
// tailwind.config.js → theme.extend
colors: {
  em:   '#10B981',  // emerald — main accent
  lime: '#A3E635',  // secondary accent
  bg:   '#020B07',  // near-black green page background
  bg2:  '#060F0A',
  bg3:  '#091510',
},
fontFamily: {
  display: ['Syne', 'sans-serif'],     // headings
  body:    ['DM Sans', 'sans-serif'],  // body
  mono:    ['DM Mono', 'monospace'],   // labels, tags
},
```

Conventions: sections use `py-28`, content wrapper `max-w-5xl mx-auto px-8`; section label = mono uppercase tracking-widest in `text-em`; heading = `font-display text-4xl font-bold`; cards = `bg-white/5 border border-em/20 rounded-lg/2xl`, hover glow `hover:shadow-em/40`. Fonts load via `next/font/google` with CSS variables in `app/layout.jsx`. Respect `prefers-reduced-motion` for animations.

---

## 9. Environment Variables (complete list)

```
MONGODB_URI=            # Atlas connection string, db name: portfolio
JWT_SECRET=             # 32+ random chars (openssl rand -hex 32)
ADMIN_PASSWORD_HASH=    # bcrypt hash of the admin password
RESEND_API_KEY=         # from resend.com
CONTACT_TO_EMAIL=       # owner's inbox
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=  # server-only, never NEXT_PUBLIC_
GITHUB_USERNAME=
GITHUB_TOKEN=           # classic token, public repo read scope
NEXT_PUBLIC_SITE_URL=   # e.g. https://asiri-portfolio.vercel.app
```

Rules: `NEXT_PUBLIC_` prefix ONLY for values safe to ship to the browser. Same variable names in Vercel dashboard for production.

---

## 10. Build Plan & Checklists (work in this order)

An agent should complete one phase fully (including its "Done when" check) before starting the next, and tick boxes in this file as it goes.

### Phase 0 — Accounts & repo
- [ ] GitHub repo `asiri-portfolio`, `.gitignore` (node_modules, .env*, .next, .DS_Store, *.log)
- [ ] Vercel, MongoDB Atlas (M0, Singapore `ap-southeast-1`), Cloudinary, Resend accounts
- [ ] Generate `JWT_SECRET` and `ADMIN_PASSWORD_HASH`; fill `.env.local`
- **Done when:** `.env.local` has every variable in Section 9 with real values.

### Phase 1 — Skeleton & data layer
- [ ] `create-next-app` (App Router, JS, Tailwind, ESLint, no src/)
- [ ] Install: `mongoose zod bcryptjs jose resend cloudinary lucide-react react-markdown @uiw/react-md-editor slugify`
- [ ] Folder structure from Section 4; theme tokens from Section 8
- [ ] `lib/db.js` cached connection; all 5 models; all zod schemas in `lib/validation.js`
- **Done when:** app runs (`npm run dev`), a test script can create + read a Project document in Atlas.

### Phase 2 — API routes
- [ ] `lib/auth.js`, `lib/rateLimit.js`, `lib/email.js`
- [ ] Auth routes (login/logout) + `middleware.js`
- [ ] All admin CRUD routes with zod validation + `revalidatePath`
- [ ] `/api/contact` (validate, honeypot, rate limit, escape, save, email)
- [ ] `/api/github` with token + 1h revalidate cache
- [ ] `/api/upload-signature`
- **Done when:** every route in Section 7 returns correct responses when tested (curl/Thunder Client), and admin routes return 401 without a cookie.

### Phase 3 — Public site
- [ ] `lib/data.js` server fetchers; home page assembles all sections as Server Components (`revalidate = 60`)
- [ ] All 8 sections + Navbar + Footer per Section 2 acceptance criteria
- [ ] ParticleCanvas background, Reveal scroll animations
- [ ] `/blog/[slug]` page with markdown rendering
- [ ] Metadata, OG tags, `sitemap.js`, `robots.js`, `not-found.jsx`
- **Done when:** `curl` of the deployed/dev homepage HTML contains real project titles (proves server rendering), and Lighthouse mobile performance ≥ 90.

### Phase 4 — Admin panel
- [ ] Login page (client) → cookie flow works end to end
- [ ] Dashboard shell with tabs + stats (computed counts)
- [ ] 5 panels with full CRUD, image upload in ProjectsPanel via signed Cloudinary upload
- [ ] Blog panel: markdown editor + draft/publish + auto slug
- **Done when:** creating/editing/deleting each content type in the UI updates the public site within 60s.

### Phase 5 — CI/CD & deploy
- [ ] `.github/workflows/ci.yml`: on push/PR → `npm ci`, `npm run lint`, `npm run build`
- [ ] Branch protection on `main` requiring CI to pass
- [ ] Import repo into Vercel, set all env vars, deploy
- **Done when:** the full end-to-end test in Section 11 passes on the LIVE URL.

### Phase 6 — Content & polish
- [ ] Real bio, real projects with screenshots, first blog post, photo, social links
- [ ] Mobile pass on real phone; optional custom domain
- **Done when:** every checkbox in Section 2 is ticked.

---

## 11. End-to-End Test Script (run after every deploy)

1. Open live URL → homepage renders with content in < 2s, no loading spinners for content.
2. View page source → project titles present in raw HTML (SSR proof).
3. Open `/admin` → login with wrong password 6× → 6th attempt returns 429.
4. Login with correct password → dashboard opens; refresh → still logged in.
5. Add a project with an uploaded image → appears on homepage within 60s.
6. Submit the contact form → email arrives; message appears in admin Messages; submitting 4× in an hour → rate limited.
7. Contact form with `<script>` in message → email shows escaped text, nothing executes.
8. Publish a blog post → `/blog/<slug>` renders markdown correctly.
9. Hit `/api/admin/projects` in an incognito window → 401.
10. Push a trivial commit → CI green → Vercel redeploys automatically.

---

## 12. Rules for Agents Working on This Project

1. **Read this file first, every session.** Align all work with it.
2. **Do not change locked decisions** (Sections 3, 6, 8) without explicitly flagging the change to the owner and updating this file with the new decision + reasoning.
3. **Update checklists** in Section 10 as work completes; if you add a feature, add its acceptance criterion to Section 2.
4. **Never** commit secrets, weaken any rule in Section 6, reintroduce a separate Express/Render backend, or convert public content sections to client-side fetching.
5. **Small, working increments:** each commit should build (`npm run build` passes) — respect branch protection.
6. **Commit message style:** `Add:`, `Fix:`, `Update:`, `Refactor:` + short description.
7. **When uncertain,** prefer: simpler > cleverer · server component > client component · free tier > paid · explicit validation > trust.
8. **If a step fails,** record the error and resolution as a short note at the bottom of this file under "## Log" (create it on first use) so future sessions don't repeat the mistake.

---

*Version 1.0 — created July 2026. Keep this file in the repo root and keep it current.*
