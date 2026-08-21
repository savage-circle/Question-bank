# Prisma Setup Guide

This project uses **Prisma ORM** with **PostgreSQL** in the **Deno + Hono** backend.

## 1. Setup PostgreSQL Locally

Install PostgreSQL on your machine.

Verify installation:

```bash
psql --version
```

Create a database for the project:

```sql
CREATE DATABASE my_database;
```

You can use any database name you prefer.

---

## 2. Configure Database URL

Open the backend environment file:

```bash
backend/.env
```

Add the PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/my_database?schema=public"
```

Replace:

* `postgres` → your PostgreSQL username
* `password` → your PostgreSQL password
* `my_database` → your database name

---

## 3. Generate Prisma Client

After configuring the database URL, generate the Prisma client:

```bash
cd backend

deno task db:generate
```

(or use the project's configured Prisma generate command)

This generates the Prisma client inside:

```text
backend/src/generated
```

---

## 4. Start Using Prisma

You can now import and use Prisma in the backend services, repositories, or routes.

Example:

```ts
import { PrismaClient } from "../generated/client.ts";

const prisma = new PrismaClient();
```

Note : We already have a `prisma.ts` file in `backend/src/lib/` that initializes the Prisma client with the PostgreSQL connection. You can import that instead of creating a new instance.

---

# Adding New Tables

Whenever you need a new table:

## Step 1: Update Prisma Schema

Open:

```text
backend/prisma/schema.prisma
```

Add a new model.

Example:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

---

## Step 2: Create & Apply Migration

Generate a migration and update the database:

```bash
cd backend

deno task db:migrate --name add-user-table
```

(Replace `add-user-table` with a meaningful migration name.)

This will:

* Create a migration file
* Apply the migration to your local database
* Update the Prisma schema state

---

## Step 3: Regenerate Prisma Client

After schema changes:

```bash
cd backend

deno task db:generate
```

This updates the generated client in:

```text
backend/src/generated
```

---

# Useful Prisma Commands

**Generate Prisma Client:**
To generate or update the Prisma client after schema changes:

```bash
deno task db:generate
```

**Create & Apply Migration:**
To create a new migration and apply it to the database:

```bash
deno task db:migrate --name <migration-name>
```

**Apply Existing Migrations:**
If you have existing migrations that need to be applied, for example when we pull changes from the repository:

```bash
deno task db:apply
```

**Seed the Database:**
To populate the database with sample categories, topics, questions, and follow-ups:

```bash
deno task db:seed
```

**Reset & Reseed the Database:**
Running `db:seed` more than once can create duplicate rows. To wipe all seeded data (follow-ups, questions, topics, categories) and reseed from a clean slate:

```bash
deno task db:seed:reset
```