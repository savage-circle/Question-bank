import { assert, assertEquals } from "@std/assert";
import { createApp } from "../../src/app.ts";
import { LevelsHandler } from "../../src/handlers/levelsHandler.ts";
import prisma from "../../src/lib/prisma.ts";
import type { Categories } from "../../src/types/categories.ts";

Deno.test({
  name: "Categories API returns seeded categories with numeric ids",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const levelsHandler = new LevelsHandler();
    try {
      const app = createApp({ levelsHandler });
      const response = await app.request("/api/categories", { method: "GET" });

      assertEquals(response.status, 200);

      const categories = (await response.json()) as Categories[];
      assert(Array.isArray(categories));

      const maths = categories.find((category) => category.name === "Maths");
      const coding = categories.find((category) => category.name === "Coding");

      assert(maths, "Expected seeded category 'Maths' to be present");
      assert(coding, "Expected seeded category 'Coding' to be present");
    } finally {
      await prisma.$disconnect();
    }
  },
});
