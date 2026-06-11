import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { createApp } from "../../src/app.ts";
import { getHandlers } from "../../main.ts";

describe("deleteQuestion", () => {
  it("return 404 when the question does not exist with the id", async () => {

    const app = createApp(getHandlers());
    const response = await app.request("/api/questions/7", { method: "DELETE" });

    assertEquals(404, response.status)
  });

  it("return 400 when the give id is not a number", async () => {

    const app = createApp(getHandlers())
    const response = await app.request("/api/questions/a", { method: "DELETE" });


    assertEquals(400, response.status)
  })
});