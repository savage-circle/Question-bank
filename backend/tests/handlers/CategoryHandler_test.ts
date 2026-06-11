import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { spy } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { Hono } from "@hono/hono";
import { CategoryHandler } from "../../src/handlers/CategoryHandler.ts";
import { IService } from "../../src/services/IService.ts";
import { Category, CreateCategoryDTO } from "../../src/types/category.ts";

describe("CategoryHandler", () => {
  const mockCategoryService: IService<Category, CreateCategoryDTO> = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    createAsync: () => Promise.resolve({ id: 1, name: "Category 1" }),
    updateAsync: () => Promise.resolve({ id: 1, name: "Category 1" }),
    deleteAsync: () => Promise.resolve(),
  };

  describe("getCategories", () => {
    it("should return all categories", async () => {
      // Arrange
      const categories = [{ id: 1, name: "Category 1" }];
      const getAllAsyncSpy = spy(() => Promise.resolve(categories));
      mockCategoryService.getAllAsync = getAllAsyncSpy;
      const categoryHandler = new CategoryHandler(mockCategoryService);
      const app = new Hono();
      app.get("/", categoryHandler.getCategories);
      const req = new Request("http://localhost/");

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, categories);
      assertEquals(getAllAsyncSpy.calls.length, 1);
    });
  });
});