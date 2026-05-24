import * as schema from "./schema.ts";

import { drizzle } from "drizzle-orm/node-postgres";

const databaseUrl = process.env.DATABASE_URL ?? "postgres://joqi:joqi@127.0.0.1:5432/joqi_postgres";

export const db = drizzle(databaseUrl, { relations: schema.relations });
