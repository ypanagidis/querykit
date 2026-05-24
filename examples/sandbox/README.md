# QueryKit Sandbox

Runs the registry resolver against a hardcoded physical registry, defaults, and policy.
The policy uses `satisfies Policy<typeof physical>` so TypeScript checks source,
field, and relation keys against the physical registry.

```bash
pnpm --filter @ypanagidis/querykit build
pnpm --filter @querykit/example-sandbox start
```
