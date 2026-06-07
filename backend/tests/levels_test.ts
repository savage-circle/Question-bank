import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { createApp } from "../src/app.ts";

describe("Levels API", () => {
  it("returns all supported levels", async () => {
    const app = createApp();
    const response = await app.request("/api/levels", { method: "GET" });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), [
      { id: 1, name: "Easy" },
      { id: 2, name: "Medium" },
      { id: 3, name: "Hard" },
    ]);
  });
});
