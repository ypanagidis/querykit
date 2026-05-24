import { describe, expect, it } from "vitest";
import { parseQuerySpec, safeParseQuerySpec } from "../src/index.js";

describe("QuerySpecSchema", () => {
  it("parses a valid query spec", () => {
    expect(
      parseQuerySpec({
        version: "v1",
        source: "placement",
        select: ["name", "status", "budget", "campaign.name"],
        where: {
          and: [
            { field: "status", op: "eq", value: "active" },
            { field: "budget", op: "gte", value: 10000 },
          ],
        },
        groupBy: ["campaign.name"],
        orderBy: [{ field: "budget", direction: "desc" }],
        limit: 50,
        offset: 0,
      }),
    ).toEqual({
      version: "v1",
      source: "placement",
      select: ["name", "status", "budget", "campaign.name"],
      where: {
        and: [
          { field: "status", op: "eq", value: "active" },
          { field: "budget", op: "gte", value: 10000 },
        ],
      },
      groupBy: ["campaign.name"],
      orderBy: [{ field: "budget", direction: "desc" }],
      limit: 50,
      offset: 0,
    });
  });

  it("rejects empty selects", () => {
    expect(
      safeParseQuerySpec({
        version: "v1",
        source: "placement",
        select: [],
      }).success,
    ).toBe(false);
  });

  it("rejects invalid filter operators", () => {
    expect(
      safeParseQuerySpec({
        version: "v1",
        source: "placement",
        select: ["name"],
        where: { field: "name", op: "raw", value: "x" },
      }).success,
    ).toBe(false);
  });
});
