# Joqi Drizzle SQLite Example

Runs Joqi through the Drizzle adapter against SQLite using Node's built-in `node:sqlite` driver.

```bash
pnpm --filter @ypanagidis/joqi build
pnpm --filter @ypanagidis/joqi-drizzle build
pnpm --filter @joqi/example-drizzle-sqlite seed
pnpm --filter @joqi/example-drizzle-sqlite start
```

The example reads a public query template with `$param` references from `input.json`, passes params through `runtime.run(...)`, and compiles with `dialect: "sqlite"`, so SQLPlan params use `?` placeholders and identifiers use double quotes.

Set `DATABASE_PATH` to override the default database path:

```txt
joqi-sqlite.db
```
