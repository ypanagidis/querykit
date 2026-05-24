import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium text-fd-muted-foreground">QueryKit</p>
        <h1 className="text-4xl font-bold tracking-tight text-fd-foreground sm:text-6xl">
          Registry-backed JSON queries for TypeScript apps.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-fd-muted-foreground">
          QueryKit validates public query templates against a trusted registry, binds params,
          compiles SQL plans, and lets adapters execute them safely.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-fd-primary px-5 py-3 text-sm font-medium text-fd-primary-foreground"
          to="/docs/$"
          params={{ _splat: undefined }}
        >
          Read the docs
        </Link>
      </section>
    </main>
  );
}
