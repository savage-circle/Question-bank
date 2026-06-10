import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { createApp } from "../../src/app.ts";
import { getHandlers } from "../../main.ts";

describe("Levels API", () => {
  it("returns all supported levels", async () => {
    const app = createApp(getHandlers());
    const response = await app.request("/api/levels", { method: "GET" });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), [
      { id: 1, name: "EASY" },
      { id: 2, name: "MEDIUM" },
      { id: 3, name: "HARD" },
    ]);
  });
});
