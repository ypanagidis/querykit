# QueryKit

QueryKit is a registry-backed JSON query compiler for TypeScript apps.

At its core, QueryKit should expose two standard contracts:

```txt
1. Query Schema
2. Registry Schema
```

Given an untrusted JSON query and a trusted registry, QueryKit validates what is allowed, lowers the query into a normalized IR, and hands that IR to an adapter such as Drizzle or Prisma.

```txt
unknown JSON
  -> QuerySpecSchema
  -> ResolvedRegistry validation
  -> QueryIR
  -> adapter compiler
  -> adapter execution
```

The package is currently private under the `@ypanagidis` npm scope.

## Install

```bash
pnpm add @ypanagidis/querykit@alpha
```

## Core Contracts

### Query Schema

The query schema is the public JSON shape accepted by QueryKit.

It should describe query intent, not raw SQL:

```json
{
  "version": "v1",
  "source": "placement",
  "select": ["name", "status", "budget", "campaign.name"],
  "where": {
    "and": [
      { "field": "status", "op": "eq", "value": "active" },
      { "field": "budget", "op": "gte", "value": 10000 }
    ]
  },
  "orderBy": [{ "field": "budget", "direction": "desc" }],
  "limit": 50
}
```

The query schema should not expose raw table names, raw column names, raw SQL fragments, or arbitrary function names.

### Registry Schema

The registry defines the allowed query universe.

QueryKit uses three registry layers:

```txt
PhysicalRegistry
  generated from ORM/schema metadata

RegistryPolicy
  user-authored allowlist and customization layer

ResolvedRegistry
  per-request effective registry used by validation and compilation
```

The physical registry says what exists.

The registry policy says what is exposed.

The resolved registry is generated from both, plus engine defaults and request context.

```ts
const resolved = resolveRegistry({
  physical,
  defaults,
  policies,
  context,
});
```

Resolution should be cheap and deterministic. It can happen on every query call so field visibility, limits, relation depth, and capabilities can vary by tenant, role, feature flag, or UI-managed configuration.

## Registry Shape

The physical registry is adapter-generated and close to the ORM/database model:

```ts
type PhysicalRegistry = {
  sources: Record<string, PhysicalSource>;
};

type PhysicalSource = {
  kind: "table" | "view" | "model";
  name: string;
  schema?: string;
  primaryKey?: string[];
  fields: Record<string, PhysicalField>;
  relations?: Record<string, PhysicalRelation>;
};
```

The policy is user-authored data. It can come from code, a database, generated configuration, or a future UI.

```ts
const policy = {
  sources: {
    placements: {
      expose: true,
      exposeAs: "placement",
      fields: {
        name: {
          expose: true,
          filterable: true,
          sortable: true,
        },
        budgetCents: {
          expose: true,
          exposeAs: "budget",
          type: "number",
          filterable: true,
          sortable: true,
          aggregations: ["sum", "avg"],
        },
      },
    },
  },
};
```

The resolved registry is what QueryKit actually compiles against. Queries only reference public names from the resolved registry.

```txt
placement.budget -> placements.budgetCents
placement.campaign.name -> join placements.campaignId = campaigns.id, then campaigns.name
```

## Adapters

Adapters have two jobs:

```txt
ORM/schema -> PhysicalRegistry
QueryIR -> adapter executable
```

For Drizzle:

```txt
Drizzle schema -> PhysicalRegistry
QueryIR -> Drizzle SQL
```

For Prisma:

```txt
Prisma schema -> PhysicalRegistry
QueryIR -> Prisma raw SQL initially
```

Prisma object-query compilation can be added later for the subset Prisma can represent cleanly. The core should not be shaped around Prisma's `findMany` API.

## Current Alpha

The current alpha has intentionally been reset to a minimal registry-first placeholder surface.

The next implementation should build this pipeline:

```txt
QuerySpecSchema.parse
  -> resolveRegistry
  -> validateQuerySpec
  -> lowerQuerySpecToIR
  -> adapter.compile
  -> adapter.execute
```

Drivers remain useful as an optional layer for business-specific specs:

```txt
business JSON
  -> driver
  -> QuerySpec
  -> QueryKit core
```

## Design Constraints

QueryKit should not become:

```txt
- a BI platform
- a no-code backend
- an ORM
- a GraphQL server
- a public SQL-in-JSON language
- an authorization framework
```

The registry controls query shape and field exposure. Per-user row-level authorization and mandatory tenant constraints should be supplied by the host application.
