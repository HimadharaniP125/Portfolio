# Prisma Setup & Database Configuration

This guide walks you through setting up Prisma for your Portfolio backend.

## What is Prisma?

Prisma is an ORM (Object-Relational Mapper) that makes it easy to:
- Define your database schema using a simple DSL.
- Generate type-safe database clients.
- Run migrations to update your database schema.
- Query data with intuitive, composable methods.

## Prerequisites

- Node.js 14+ installed.
- A PostgreSQL database (local or cloud-hosted, e.g., Supabase, Railway, Render, ElephantSQL).

## Quick Setup

### 1. Install Dependencies

```bash
cd portfolio
npm install
```

This installs `prisma` and `@prisma/client`.

### 2. Configure Database URL

Create a `.env.local` file in the `portfolio` folder (or copy `.env.example`):

```bash
cp .env.example .env.local
```

Update `.env.local` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
```

#### Connection String Examples

**Local PostgreSQL:**
```
postgresql://postgres:password@localhost:5432/portfolio_db
```

**Supabase (cloud):**
```
postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres
```

**Railway / Render / ElephantSQL:**
Follow their connection string format (usually starts with `postgresql://`).

### 3. Create & Run Your First Migration

The Prisma schema is already defined in `prisma/schema.prisma` with two tables:
- **Contact** – for storing contact form submissions.
- **Project** – for storing portfolio projects.

To create the database tables:

```bash
npm run prisma:migrate
```

This will:
1. Create a new migration file in `prisma/migrations/`.
2. Ask for a migration name (e.g., `init`).
3. Execute the migration on your database.

### 4. Verify & Explore

Open Prisma Studio (visual database explorer):

```bash
npm run prisma:studio
```

This opens `http://localhost:5555` where you can view and edit your data.

## Using Prisma in Your API

Update your API endpoints (`api/contacts.js`, `api/projects.js`) to use Prisma instead of raw `pg`:

### Example: Contacts API with Prisma

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return res.status(200).json({ data: contacts });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }

  if (req.method === 'POST') {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      const contact = await prisma.contact.create({
        data: { name, email, message }
      });
      return res.status(201).json({ data: contact });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create contact' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
}
```

## Deploying to Vercel with Prisma

1. **Push your database URL to Vercel:**
   - Go to your Vercel project settings.
   - Environment Variables.
   - Add `DATABASE_URL` with your PostgreSQL connection string.

2. **Update your deployment build command (optional):**
   - In `vercel.json` or Vercel settings, ensure the build command runs:
     ```bash
     npm run prisma:generate && npm run build
     ```

3. **Deploy:**
   ```bash
   vercel deploy --prod
   ```

## Useful Prisma Commands

- **Generate Prisma Client:** `npm run prisma:generate`
- **Run Migrations:** `npm run prisma:migrate`
- **Open Studio:** `npm run prisma:studio`
- **View migrations:** `ls prisma/migrations/`
- **Reset database (dev only):** `npx prisma db push --skip-generate` (destructive!)

## Common Issues

**Issue:** `Environment variable not found: DATABASE_URL`
- **Solution:** Ensure `.env.local` is in the `portfolio` folder and contains `DATABASE_URL`.

**Issue:** Migration fails with "relation already exists"
- **Solution:** The tables may already exist. Run `npx prisma db push` to sync your schema.

**Issue:** Prisma Client not generated
- **Solution:** Run `npm run prisma:generate` to regenerate the client.

## Next Steps

- Integrate Prisma into your API endpoints (see example above).
- Add more fields to the schema as needed (e.g., skills, education).
- Set up a CI/CD pipeline to run migrations on deploy (Vercel + GitHub Actions).

For more details, visit the [Prisma documentation](https://www.prisma.io/docs/).
