import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { createApp } from "../../src/app.ts";
import { LevelsHandler } from "../../src/handlers/levelsHandler.ts";

describe("Levels API", () => {
  it("returns all supported levels", async () => {
    const levelsHandler = new LevelsHandler();

    const app = createApp({ levelsHandler });
    const response = await app.request("/api/levels", { method: "GET" });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), [
      { id: 1, name: "EASY" },
      { id: 2, name: "MEDIUM" },
      { id: 3, name: "HARD" },
    ]);
  });
});
