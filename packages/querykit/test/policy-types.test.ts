import { describe, expect, it } from "vitest";
import type { Policy } from "../src/index.js";

const physicalRegistry = {
  version: "v1",
  sources: {
    placements: {
      kind: "table",
      name: "placements",
      fields: {
        id: { type: "string", nullable: false },
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
      fields: {
        id: { type: "string", nullable: false },
        name: { type: "string", nullable: false },
      },
    },
  },
} as const;

describe("Policy<TPhysical>", () => {
  it("supports policies constrained by a physical registry", () => {
    const policy = {
      version: "v1",
      sources: {
        placements: {
          expose: true,
          fields: {
            budgetCents: {
              expose: true,
              exposeAs: "budget",
              filterable: true,
            },
          },
          relations: {
            campaign: {
              expose: true,
              target: "campaign",
            },
          },
        },
      },
    } satisfies Policy<typeof physicalRegistry>;

    expect(policy.sources.placements.fields.budgetCents.exposeAs).toBe("budget");
  });
});

const policyWithUnknownSource = {
  version: "v1",
  sources: {
    // @ts-expect-error policies can only reference physical source keys
    missing: {
      expose: true,
    },
  },
} satisfies Policy<typeof physicalRegistry>;

const policyWithUnknownField = {
  version: "v1",
  sources: {
    placements: {
      fields: {
        // @ts-expect-error field policies can only reference that source's physical field keys
        missing: {
          expose: true,
        },
      },
    },
  },
} satisfies Policy<typeof physicalRegistry>;

const policyWithUnknownRelation = {
  version: "v1",
  sources: {
    placements: {
      relations: {
        // @ts-expect-error relation policies can only reference that source's physical relation keys
        missing: {
          expose: true,
        },
      },
    },
  },
} satisfies Policy<typeof physicalRegistry>;

const policyWithRelationOnSourceWithoutRelations = {
  version: "v1",
  sources: {
    campaigns: {
      // @ts-expect-error sources without physical relations cannot define relation policies
      relations: {
        owner: {
          expose: true,
        },
      },
    },
  },
} satisfies Policy<typeof physicalRegistry>;

void policyWithUnknownSource;
void policyWithUnknownField;
void policyWithUnknownRelation;
void policyWithRelationOnSourceWithoutRelations;
