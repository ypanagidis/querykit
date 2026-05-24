declare module "fumadocs-core/search/server" {
  export function createFromSource(
    source: unknown,
    options?: { readonly language?: string },
  ): {
    readonly GET: (request: Request) => Response | Promise<Response>;
  };
}
