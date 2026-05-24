import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-fd-border/70 pb-5">
          <Link className="font-mono text-sm font-semibold tracking-tight" to="/">
            Joqi
          </Link>
          <nav className="flex items-center gap-5 font-mono text-xs text-fd-muted-foreground">
            <Link
              className="transition hover:text-fd-foreground"
              to="/docs/$"
              params={{ _splat: undefined }}
            >
              docs
            </Link>
            <a
              className="transition hover:text-fd-foreground"
              href="https://github.com/ypanagidis/joqi"
            >
              github
            </a>
          </nav>
        </header>

        <section className="grid min-h-[calc(100vh-5.25rem)] min-w-0 items-center gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-10">
          <div className="min-w-0">
            <p className="mb-5 inline-flex rounded-full border border-fd-border bg-fd-muted px-3 py-1 font-mono text-xs text-fd-muted-foreground">
              JSON query compiler for TypeScript backends
            </p>
            <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              JSON queries your backend can trust.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-fd-muted-foreground">
              Joqi lets product surfaces send structured JSON for filters, sorting, selected fields,
              and joins. Your server validates that JSON against a registry, binds params, and
              compiles the approved query for your database adapter.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full bg-fd-primary px-5 font-mono text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
                to="/docs/$"
                params={{ _splat: undefined }}
              >
                Read the docs
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full border border-fd-border px-5 font-mono text-sm font-medium transition hover:bg-fd-muted"
                to="/docs/$"
                params={{ _splat: "quickstart" }}
              >
                Quickstart
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-fd-border/70 pt-6 font-mono text-xs">
              <div>
                <dt className="text-fd-muted-foreground">dialects</dt>
                <dd className="mt-1 font-medium">mysql pg sqlite</dd>
              </div>
              <div>
                <dt className="text-fd-muted-foreground">input</dt>
                <dd className="mt-1 font-medium">json</dd>
              </div>
              <div>
                <dt className="text-fd-muted-foreground">output</dt>
                <dd className="mt-1 font-medium">SQLPlan</dd>
              </div>
            </dl>
          </div>

          <CodePanel />
        </section>

        <section className="border-t border-fd-border/70 py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fd-muted-foreground">
              The contract
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Product surfaces send JSON. Your backend decides what it means.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <CodeExample title="1. JSON query from an invoice table or report" label="query.json">
              {`{
  "version": "v1",
  "source": "invoice",
  "select": ["number", "status", "total", "customer.name"],
  "where": {
    "and": [
      { "field": "status", "op": "eq", "value": { "$param": "status" } },
      { "field": "total", "op": "gte", "value": { "$param": "minTotal" } }
    ]
  },
  "orderBy": [{ "field": "total", "direction": "desc" }],
  "limit": { "$param": "limit" }
}`}
            </CodeExample>

            <CodeExample title="2. Registry policy owned by your backend" label="registry.ts">
              {`const policy = {
  version: "v1",
  sources: {
    invoices: {
      expose: true,
      exposeAs: "invoice",
      fields: {
        number: { expose: true, filterable: true, sortable: true },
        status: { expose: true, filterable: true },
        totalCents: {
          expose: true,
          exposeAs: "total",
          operators: ["eq", "gt", "gte", "lt", "lte"]
        }
      },
      relations: {
        customer: { expose: true, target: "customer", selectable: true }
      }
    }
  }
};`}
            </CodeExample>

            <CodeExample title="3. Server route binds request params" label="server.ts">
              {`const result = await runtime.run({
  spec: body.query,
  params: {
    status: body.status,
    minTotal: body.minTotal,
    limit: 25
  },
  explain: true
});

return Response.json({ rows: result.rows });`}
            </CodeExample>

            <CodeExample title="4. Approved query compiles to a SQLPlan" label="explain.sqlPlan">
              {`{
  "dialect": "postgres",
  "sql": "select ... where \u005C"invoices\u005C".\u005C"status\u005C" = $1 and \u005C"invoices\u005C".\u005C"totalCents\u005C" >= $2 limit $3",
  "params": ["open", 10000, 25]
}`}
            </CodeExample>
          </div>
        </section>

        <section className="space-y-20 border-t border-fd-border/70 py-20">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fd-muted-foreground">
              Backend control
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Adapters run the query. Policies define the surface.
            </h2>
            <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">
              Joqi keeps the core small: validate public JSON, compile a SQLPlan, and hand it to
              backend-owned execution and policy layers.
            </p>
          </div>

          <ControlPanel
            eyebrow="Adapters"
            title="Execution stays behind your backend."
            body="Use the Drizzle adapter today, or provide one executor function for your database client. Joqi hands over dialect-specific SQL text and bound params."
            items={["Drizzle adapter", "Bring your own executor", "MySQL / PostgreSQL / SQLite"]}
            code={`const runtime = createQueryRuntime({
  db,
  physicalRegistry,
  defaults,
  policy,
  dialect: "postgres",
  executor: drizzleExecutor()
});`}
            label="adapter.ts"
          />

          <ControlPanel
            eyebrow="Policies"
            title="JSON only means what you expose."
            body="The same JSON shape can power invoice tables, exports, and revenue dashboards, but every source, field, relation, operator, and limit is policy-owned."
            items={["Expose public names", "Restrict operators", "Cap limits and relation depth"]}
            code={`const policy = {
  sources: {
    invoices: {
      expose: true,
      exposeAs: "invoice",
      fields: {
        number: { expose: true, sortable: true },
        totalCents: {
          expose: true,
          exposeAs: "total",
          operators: ["eq", "gte", "lte"]
        }
      }
    }
  }
};`}
            label="policy.ts"
          />
        </section>
      </div>
    </main>
  );
}

function CodeExample({
  label,
  title,
  children,
}: Readonly<{ label: string; title: string; children: string }>) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/40 px-4 py-3">
        <h3 className="text-sm font-medium tracking-[-0.02em]">{title}</h3>
        <p className="font-mono text-xs text-fd-muted-foreground">{label}</p>
      </div>
      <pre className="max-w-full flex-1 overflow-x-auto p-4 text-[12px] leading-5">
        <HighlightedCode code={children} />
      </pre>
    </article>
  );
}

function ControlPanel({
  eyebrow,
  title,
  body,
  items,
  code,
  label,
}: Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  items: readonly string[];
  code: string;
  label: string;
}>) {
  return (
    <article className="grid min-w-0 items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
          {eyebrow}
        </p>
        <h3 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-6 text-fd-muted-foreground">{body}</p>
        <div className="mt-6 grid gap-2 font-mono text-xs text-fd-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
          {items.map((item) => (
            <p key={item} className="rounded-lg border border-fd-border bg-fd-muted/30 p-3">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="relative min-w-0">
        <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-fd-primary/10 via-transparent to-fd-muted blur-2xl" />
        <div className="relative max-w-full overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-2xl shadow-fd-primary/5">
          <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/40 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-fd-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-fd-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-fd-primary" />
            </div>
            <p className="font-mono text-xs text-fd-muted-foreground">{label}</p>
          </div>
          <pre className="max-w-full overflow-x-auto p-5 text-[13px] leading-6 sm:p-6">
            <HighlightedCode code={code} />
          </pre>
        </div>
      </div>
    </article>
  );
}

function CodePanel() {
  return (
    <div className="relative min-w-0">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-fd-primary/12 via-transparent to-fd-muted blur-2xl" />
      <div className="relative max-w-full overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-2xl shadow-fd-primary/5">
        <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-fd-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-fd-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-fd-primary" />
          </div>
          <p className="font-mono text-xs text-fd-muted-foreground">server/report-route.ts</p>
        </div>

        <pre className="max-w-full overflow-x-auto p-5 text-[13px] leading-6 sm:p-6">
          <code className="block min-w-max font-mono">
            <CodeKeyword>const</CodeKeyword> <CodeName>report</CodeName> <CodeMuted>=</CodeMuted>{" "}
            <CodePunctuation>{"{"}</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>version</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"v1"</CodeString>
            <CodePunctuation>,</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>source</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"invoice"</CodeString>
            <CodePunctuation>,</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>select</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>[</CodePunctuation>
            <CodeString>"number"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeString>"total"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeString>"customer.name"</CodeString>
            <CodePunctuation>],</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>where</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>{"{"}</CodePunctuation>
            {"\n"}
            {"    "}
            <CodeProperty>and</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>[</CodePunctuation>
            {"\n"}
            {"      "}
            <CodePunctuation>{"{"}</CodePunctuation> <CodeProperty>field</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"status"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeProperty>op</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"eq"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeProperty>value</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>{"{"}</CodePunctuation>{" "}
            <CodeParam>$param</CodeParam>
            <CodePunctuation>:</CodePunctuation> <CodeString>"status"</CodeString>{" "}
            <CodePunctuation>{"}"}</CodePunctuation> <CodePunctuation>{"}"}</CodePunctuation>
            <CodePunctuation>,</CodePunctuation>
            {"\n"}
            {"      "}
            <CodePunctuation>{"{"}</CodePunctuation> <CodeProperty>field</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"total"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeProperty>op</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"gte"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeProperty>value</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>{"{"}</CodePunctuation>{" "}
            <CodeParam>$param</CodeParam>
            <CodePunctuation>:</CodePunctuation> <CodeString>"minTotal"</CodeString>{" "}
            <CodePunctuation>{"}"}</CodePunctuation> <CodePunctuation>{"}"}</CodePunctuation>
            {"\n"}
            {"    "}
            <CodePunctuation>]</CodePunctuation>
            {"\n"}
            {"  "}
            <CodePunctuation>{"}"}</CodePunctuation>
            <CodePunctuation>,</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>limit</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>{"{"}</CodePunctuation>{" "}
            <CodeParam>$param</CodeParam>
            <CodePunctuation>:</CodePunctuation> <CodeString>"limit"</CodeString>{" "}
            <CodePunctuation>{"}"}</CodePunctuation>
            {"\n"}
            <CodePunctuation>{"}"}</CodePunctuation>
            <CodePunctuation>;</CodePunctuation>
            {"\n\n"}
            <CodeKeyword>const</CodeKeyword> <CodeName>result</CodeName> <CodeMuted>=</CodeMuted>{" "}
            <CodeKeyword>await</CodeKeyword> <CodeName>runtime</CodeName>
            <CodePunctuation>.</CodePunctuation>
            <CodeFunction>run</CodeFunction>
            <CodePunctuation>{"({"}</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>spec</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeName>report</CodeName>
            <CodePunctuation>,</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>params</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodePunctuation>{"{"}</CodePunctuation>{" "}
            <CodeProperty>status</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeString>"open"</CodeString>
            <CodePunctuation>,</CodePunctuation> <CodeProperty>minTotal</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeNumber>10000</CodeNumber>
            <CodePunctuation>,</CodePunctuation> <CodeProperty>limit</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeNumber>25</CodeNumber>{" "}
            <CodePunctuation>{"}"}</CodePunctuation>
            <CodePunctuation>,</CodePunctuation>
            {"\n"}
            {"  "}
            <CodeProperty>explain</CodeProperty>
            <CodePunctuation>:</CodePunctuation> <CodeBoolean>true</CodeBoolean>
            {"\n"}
            <CodePunctuation>{"}"}</CodePunctuation>
            <CodePunctuation>);</CodePunctuation>
          </code>
        </pre>

        <div className="grid border-t border-fd-border bg-fd-muted/30 p-4 font-mono text-xs text-fd-muted-foreground sm:grid-cols-3">
          <p>JSON query in</p>
          <p>registry validates</p>
          <p>trusted plan out</p>
        </div>
      </div>
    </div>
  );
}

const codeTokenPattern =
  /("(?:\\.|[^"\\])*"|\$param|\b(?:const|await|return)\b|\b(?:true|false)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*:)|[{}[\]():;,.=]|\s+|[A-Za-z_][A-Za-z0-9_]*)/g;

function HighlightedCode({ code }: Readonly<{ code: string }>) {
  return <code className="block min-w-max font-mono">{highlightCode(code)}</code>;
}

function highlightCode(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of code.matchAll(codeTokenPattern)) {
    const token = match[0];
    const index = match.index;

    if (index > cursor) {
      nodes.push(code.slice(cursor, index));
    }

    nodes.push(highlightToken(token, code.slice(index + token.length), nodes.length));
    cursor = index + token.length;
  }

  if (cursor < code.length) {
    nodes.push(code.slice(cursor));
  }

  return nodes;
}

function highlightToken(token: string, rest: string, key: number): ReactNode {
  if (token.trim() === "") {
    return token;
  }

  if (token.startsWith('"')) {
    if (/^\s*:/.test(rest)) {
      return <CodeProperty key={key}>{token}</CodeProperty>;
    }

    return <CodeString key={key}>{token}</CodeString>;
  }

  if (token === "$param") {
    return <CodeParam key={key}>{token}</CodeParam>;
  }

  if (token === "const" || token === "await" || token === "return") {
    return <CodeKeyword key={key}>{token}</CodeKeyword>;
  }

  if (token === "true" || token === "false") {
    return <CodeBoolean key={key}>{token}</CodeBoolean>;
  }

  if (/^\d/.test(token)) {
    return <CodeNumber key={key}>{token}</CodeNumber>;
  }

  if (/^[A-Za-z_]/.test(token) && /^\s*:/.test(rest)) {
    return <CodeProperty key={key}>{token}</CodeProperty>;
  }

  if (/^[{}[\]():;,.=]$/.test(token)) {
    return <CodePunctuation key={key}>{token}</CodePunctuation>;
  }

  return <CodeName key={key}>{token}</CodeName>;
}

function CodeKeyword({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-blue-500 dark:text-blue-300">{children}</span>;
}

function CodeName({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-fd-foreground">{children}</span>;
}

function CodeProperty({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-emerald-600 dark:text-emerald-300">{children}</span>;
}

function CodeString({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-amber-600 dark:text-amber-300">{children}</span>;
}

function CodeParam({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-pink-600 dark:text-pink-300">{children}</span>;
}

function CodeFunction({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-violet-600 dark:text-violet-300">{children}</span>;
}

function CodeNumber({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-cyan-600 dark:text-cyan-300">{children}</span>;
}

function CodeBoolean({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-orange-600 dark:text-orange-300">{children}</span>;
}

function CodePunctuation({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-fd-muted-foreground">{children}</span>;
}

function CodeMuted({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-fd-muted-foreground">{children}</span>;
}
