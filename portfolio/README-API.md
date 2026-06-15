API and Vercel deployment

This folder contains a small serverless API (Vercel) for the portfolio with two endpoints:

- `GET/POST /api/contacts` - store and list contact form submissions
- `GET/POST /api/projects` - store and list projects

Storage modes

- Production (recommended): provide a `DATABASE_URL` environment variable pointing to a PostgreSQL-compatible database (Supabase, ElephantSQL, PlanetScale (MySQL via Prisma), etc.). The functions use `pg` and expect a Postgres connection string.
- Local fallback: if `DATABASE_URL` is not set, the APIs will read/write local JSON files at `server/data/` (useful for local dev).

Quick local test

1. Install deps:

```bash
cd portfolio
npm install
```

2. Run the dev server (Vite) and test endpoints locally (Vercel serverless functions are available under `/api` when using `vercel dev` or when deployed):

```bash
npm run dev
# or install vercel CLI and run
# npm i -g vercel
# vercel dev
```

Connecting a Production Database (Supabase example)

1. Create a project at https://supabase.com and create a new database.
2. Create simple tables:

```sql
create table contacts (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

create table projects (
  id bigserial primary key,
  title text not null,
  description text not null,
  url text,
  tags text[],
  created_at timestamptz default now()
);
```

3. Copy the Supabase (Postgres) connection string (NETWORK -> Connection) as `DATABASE_URL`.

Deploy to Vercel

1. Install the Vercel CLI and login:

```bash
npm i -g vercel
vercel login
```

2. From the `portfolio` folder, run:

```bash
vercel --prod
```

3. In the Vercel dashboard, go to Project Settings -> Environment Variables and set `DATABASE_URL` to your Postgres connection string (for production environment). Redeploy after setting the env var.

Notes

- Serverless functions should not use local file storage in production (ephemeral). Use the database mode for production.
- If you'd prefer Prisma or an ORM, I can scaffold Prisma + migrations instead.

If you want, I can now:
- scaffold Prisma and migrations,
- add a contact form to the front-end that posts to `/api/contacts`, or
- set up a Supabase project for you (requires your cloud credentials).