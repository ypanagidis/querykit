# Joqi Drizzle

Drizzle adapter for Joqi physical registries and SQL plans.

This package intentionally keeps a small adapter surface:

```txt
Drizzle schema + rc3 relations -> PhysicalRegistry
SQLPlan -> Drizzle SQL object -> db.execute(...)
```

It does not compile Joqi queries into Drizzle query-builder calls. Core Joqi already compiles `QuerySpec + ResolvedRegistry` into a MySQL `SQLPlan`; this package creates the trusted physical registry from Drizzle metadata and executes SQL plans through a Drizzle-compatible database object.

## Install

```bash
pnpm add @ypanagidis/joqi @ypanagidis/joqi-drizzle drizzle-orm@1.0.0-rc.3
```

## Usage

```ts
import { createQueryRuntime } from "@ypanagidis/joqi";
import {
  createPhysicalRegistryFromDrizzle,
  drizzleExecutor,
} from "@ypanagidis/joqi-drizzle";

const physical = createPhysicalRegistryFromDrizzle({
  schema,
  relations: (r) => ({
    placements: {
      campaign: r.one.campaigns({
        from: r.placements.campaignId,
        to: r.campaigns.id,
      }),
    },
  }),
});

const runtime = createQueryRuntime({
  db,
  physicalRegistry: physical,
  defaults,
  policy,
  dialect: "mysql",
  executor: drizzleExecutor(),
});

const result = await runtime.run({
  spec,
  params,
  explain: true,
});
```

The adapter converts MySQL/SQLite `?` placeholders and PostgreSQL `$1`, `$2`, ... placeholders in the Joqi `SQLPlan` into Drizzle params using `sql.param(...)`, then calls `db.execute(...)` or SQLite-style `db.all(...)`.

## API

```ts
type DrizzleExecutor<TResult = unknown> = {
  execute?: (query: SQL) => TResult | Promise<TResult>;
  all?: (query: SQL) => TResult | Promise<TResult>;
};

type ExecuteSQLPlanWithDrizzleInput<TResult = unknown> = {
  db: DrizzleExecutor<TResult>;
  plan: SQLPlan;
};
```

```ts
sqlPlanToDrizzleSQL(plan);
executeSQLPlanWithDrizzle({ db, plan });
drizzleExecutor();
createPhysicalRegistryFromDrizzle({ schema, relations });
createPhysicalRegistryFromDrizzleRelations(relations);
```

## Current Scope

Implemented:

- Convert `SQLPlan` to Drizzle `SQL`
- Preserve bound params
- Execute through `db.execute(...)` or `db.all(...)`
- Provide `drizzleExecutor()` for `createQueryRuntime`
- Wrap execution failures in `DrizzleExecutionError`
- Create a Joqi `PhysicalRegistry` from Drizzle rc3 `defineRelations(...)` metadata

Not implemented yet:

- Drizzle query-builder compilation
