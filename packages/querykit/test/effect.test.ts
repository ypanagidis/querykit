import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import {
  RegistryParseError,
  RegistryResolutionError,
  resolveRegistryEffect,
  resolveRegistryPromise,
} from "../src/effect.js";

describe("resolveRegistryEffect", () => {
  it("resolves registries as an Effect", async () => {
    const resolved = await Effect.runPromise(
      resolveRegistryEffect({
        physical: makePhysicalRegistry(),
        policies: [
          {
            version: "v1",
            sources: {
              placements: {
                expose: true,
                exposeAs: "placement",
                fields: {
                  name: {
                    expose: true,
                  },
                },
              },
            },
          },
        ],
      }),
    );

    expect(Object.keys(resolved.sources)).toEqual(["placement"]);
    expect(Object.keys(resolved.sources.placement!.fields)).toEqual(["name"]);
  });

  it("provides a promise facade", async () => {
    const resolved = await resolveRegistryPromise({
      physical: makePhysicalRegistry(),
      policies: [
        {
          version: "v1",
          sources: {
            placements: {
              expose: true,
              fields: {
                name: {
                  expose: true,
                },
              },
            },
          },
        },
      ],
    });

    expect(Object.keys(resolved.sources.placements!.fields)).toEqual(["name"]);
  });

  it("fails with typed resolution errors", async () => {
    const error = await Effect.runPromise(
      resolveRegistryEffect({
        physical: makePhysicalRegistry(),
        policies: [
          {
            version: "v1",
            sources: {
              missing: {
                expose: true,
              },
            },
          },
        ],
      }).pipe(Effect.flip),
    );

    expect(error).toBeInstanceOf(RegistryResolutionError);
    expect(error._tag).toBe("RegistryResolutionError");
    expect(error).toMatchObject({
      issues: [{ code: "unknown_source", source: "missing" }],
    });
  });

  it("fails with typed parse errors", async () => {
    const error = await Effect.runPromise(
      resolveRegistryEffect({
        physical: {
          version: "v1",
          sources: {},
        },
      }).pipe(Effect.flip),
    );

    expect(error).toBeInstanceOf(RegistryParseError);
    expect(error._tag).toBe("RegistryParseError");
  });
});

const makePhysicalRegistry = () =>
  ({
    version: "v1",
    sources: {
      placements: {
        kind: "table",
        name: "placements",
        fields: {
          id: { type: "string", nullable: false },
          name: { type: "string", nullable: false },
        },
      },
    },
  }) as const;
