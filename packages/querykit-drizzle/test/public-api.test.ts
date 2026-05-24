import { describe, expect, it } from "vitest";

import * as publicApi from "../src/index.js";

describe("public API", () => {
  it("exports the stable Drizzle adapter surface", () => {
    expect(Object.keys(publicApi).sort()).toEqual([
      "DrizzleExecutionError",
      "createPhysicalRegistryFromDrizzle",
      "createPhysicalRegistryFromDrizzleRelations",
      "drizzleExecutor",
      "executeSQLPlanWithDrizzle",
      "sqlPlanToDrizzleSQL",
    ]);
  });
});
