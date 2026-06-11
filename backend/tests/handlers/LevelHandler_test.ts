import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { Hono } from "@hono/hono";
import { LevelHandler } from "../../src/handlers/LevelHandler.ts";
import LevelType from "../../src/enums/levelType.ts";

describe("LevelHandler", () => {
  describe("getLevels", () => {
    it("should return all levels", async () => {
      // Arrange
      const levelHandler = new LevelHandler();
      const app = new Hono();
      app.get("/", levelHandler.getLevels);
      const req = new Request("http://localhost/");

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      const expected = Object.keys(LevelType)
        .filter((key) => isNaN(Number(key)))
        .map((key) => ({
          id: LevelType[key as keyof typeof LevelType],
          name: key,
        }));
      assertEquals(result, expected);
    });
  });
});