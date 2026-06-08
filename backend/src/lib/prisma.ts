import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Initialize the PostgreSQL driver connection pool
const pool = new pg.Pool({
  connectionString: Deno.env.get("DATABASE_URL"),
});

// 2. Set up the Prisma driver adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate Prisma Client with the driver adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
