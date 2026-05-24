import { resolveRegistry, type Policy } from "@ypanagidis/querykit";

const physical = {
  version: "v1",
  sources: {
    placements: {
      kind: "table",
      name: "placements",
      primaryKey: ["id"],
      fields: {
        id: { type: "string", nullable: false },
        name: { type: "string", nullable: false },
        status: {
          type: "enum",
          nullable: false,
          enumValues: ["active", "paused", "archived"],
        },
        budgetCents: { type: "number", nullable: false },
        campaignId: { type: "string", nullable: false },
      },
      relations: {
        campaign: {
          kind: "one",
          target: "campaigns",
          localFields: ["campaignId"],
          foreignFields: ["id"],
        },
      },
    },
    campaigns: {
      kind: "table",
      name: "campaigns",
      primaryKey: ["id"],
      fields: {
        id: { type: "string", nullable: false },
        name: { type: "string", nullable: false },
        ownerUserId: { type: "string", nullable: false },
      },
      relations: {
        owner: {
          kind: "one",
          target: "users",
          localFields: ["ownerUserId"],
          foreignFields: ["id"],
        },
      },
    },
    users: {
      kind: "table",
      name: "users",
      primaryKey: ["id"],
      fields: {
        id: { type: "string", nullable: false },
        email: { type: "string", nullable: false },
        displayName: { type: "string", nullable: true },
      },
    },
  },
} as const;

const defaults = {
  exposure: "deny-by-default",
  source: {
    selectable: true,
    filterable: true,
    sortable: true,
    maxLimit: 100,
  },
  field: {
    selectable: true,
    filterable: false,
    sortable: false,
    groupable: false,
    operators: "byType",
  },
  relation: {
    selectable: false,
    filterable: false,
    maxDepth: 1,
  },
} as const;

const basePolicy = {
  version: "v1",
  sources: {
    placements: {
      expose: true,
      exposeAs: "placement",
      label: "Placement",
      defaultLimit: 25,
      fields: {
        name: {
          expose: true,
          filterable: true,
          sortable: true,
        },
        status: {
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
          operators: ["eq", "gt", "gte", "lt", "lte"],
        },
      },
      relations: {
        campaign: {
          expose: true,
          target: "campaign",
          selectable: true,
          filterable: true,
          maxDepth: 1,
        },
      },
    },
    campaigns: {
      expose: true,
      exposeAs: "campaign",
      label: "Campaign",
      fields: {
        name: {
          expose: true,
          filterable: true,
          sortable: true,
        },
      },
    },
  },
} satisfies Policy<typeof physical>;

const resolved = resolveRegistry({
  physical,
  defaults,
  policies: [basePolicy],
});

console.log(JSON.stringify(resolved, null, 2));
