# Joqi Drizzle PostgreSQL Example

Runs Joqi through the Drizzle adapter against PostgreSQL.

```bash
pnpm --filter @ypanagidis/joqi build
pnpm --filter @ypanagidis/joqi-drizzle build
pnpm --filter @joqi/example-drizzle-postgres db:up
pnpm --filter @joqi/example-drizzle-postgres db:push
pnpm --filter @joqi/example-drizzle-postgres seed
pnpm --filter @joqi/example-drizzle-postgres start
```

The example reads a public query template with `$param` references from `input.json`, passes params through `runtime.run(...)`, and compiles with `dialect: "postgres"`, so SQLPlan params use `$1`, `$2`, ... placeholders.

Default connection string:

```txt
postgres://joqi:joqi@127.0.0.1:5432/joqi_postgres
```
