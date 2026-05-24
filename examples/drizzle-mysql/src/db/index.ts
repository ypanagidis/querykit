import * as schema from "./schema.ts";

import { drizzle } from "drizzle-orm/mysql2";

const databaseUrl = process.env.DATABASE_URL ?? "mysql://joqi:joqi@127.0.0.1:3307/joqi_mysql";

export const db = drizzle(databaseUrl, { relations: schema.relations });
