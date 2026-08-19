import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { spy } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { Hono } from "@hono/hono";
import { CategoryHandler } from "../../src/handlers/CategoryHandler.ts";
import { ICategoryService } from "../../src/services/ICategoryService.ts";
import { createMockValidationService } from "../mocks/validationService.ts";
describe("CategoryHandler", () => {
  const mockCategoryService: ICategoryService = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    existsByNameAsync: () => Promise.resolve(false),
    createAsync: () => Promise.resolve({ id: 1, name: "Category 1" }),
    updateAsync: () => Promise.resolve({ id: 1, name: "Category 1" }),
    deleteAsync: () => Promise.resolve(),
  };

  const mockValidationService = createMockValidationService();

  describe("getCategories", () => {
    it("should return all categories", async () => {
      // Arrange
      const categories = [{ id: 1, name: "Category 1" }];
      const getAllAsyncSpy = spy(() => Promise.resolve(categories));
      mockCategoryService.getAllAsync = getAllAsyncSpy;
      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        mockValidationService,
      );
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

  describe("createCategory", () => {
    it("should create a category successfully", async () => {
      // Arrange
      mockCategoryService.existsByNameAsync = () => Promise.resolve(false);
      mockCategoryService.createAsync = () =>
        Promise.resolve({ id: 1, name: "Mathematics" });

      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", categoryHandler.createCategory);

      // Act
      const res = await app.request(
        new Request("http://localhost/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "Mathematics" }),
        }),
      );
      const result = await res.json();

      // Assert
      assertEquals(res.status, 201);
      assertEquals(result, { id: 1, name: "Mathematics" });
    });

    it("should return 400 if categoryName is empty", async () => {
      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        createMockValidationService({
          validateCreateCategoryInput: () => ({
            isValid: false,
            error: "Category name is required.",
          }),
        }),
      );
      const app = new Hono();
      app.post("/", categoryHandler.createCategory);

      const res = await app.request(
        new Request("http://localhost/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 400);
      assertEquals(result, { error: "Category name is required." });
    });

    it("should return 409 if category name already exists", async () => {
      mockCategoryService.existsByNameAsync = () => Promise.resolve(true);

      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", categoryHandler.createCategory);

      const res = await app.request(
        new Request("http://localhost/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "Mathematics" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 409);
      assertEquals(result, { error: "Category name already exists." });
    });
  });

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      // Arrange
      mockCategoryService.existsAsync = () => Promise.resolve(true);
      mockCategoryService.existsByNameAsync = () => Promise.resolve(false);
      mockCategoryService.updateAsync = () =>
        Promise.resolve({ id: 1, name: "Advanced Mathematics" });

      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.put("/:id", categoryHandler.updateCategory);

      const res = await app.request(
        new Request("http://localhost/1", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "Advanced Mathematics" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 200);
      assertEquals(result, { id: 1, name: "Advanced Mathematics" });
    });

    it("should return 400 if id is invalid", async () => {
      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        createMockValidationService({
          validateUpdateCategoryInput: () => ({
            isValid: false,
            error: "Invalid category id.",
          }),
        }),
      );
      const app = new Hono();
      app.put("/:id", categoryHandler.updateCategory);

      const res = await app.request(
        new Request("http://localhost/abc", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "Maths" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 400);
      assertEquals(result, { error: "Invalid category id." });
    });

    it("should return 400 if categoryName is empty", async () => {
      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        createMockValidationService({
          validateUpdateCategoryInput: () => ({
            isValid: false,
            error: "Category name is required.",
          }),
        }),
      );
      const app = new Hono();
      app.put("/:id", categoryHandler.updateCategory);

      const res = await app.request(
        new Request("http://localhost/1", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 400);
      assertEquals(result, { error: "Category name is required." });
    });

    it("should return 404 if category does not exist", async () => {
      mockCategoryService.existsAsync = () => Promise.resolve(false);

      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.put("/:id", categoryHandler.updateCategory);

      const res = await app.request(
        new Request("http://localhost/99", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "Maths" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 404);
      assertEquals(result, { error: "Category does not exist." });
    });

    it("should return 409 if category name already exists", async () => {
      mockCategoryService.existsAsync = () => Promise.resolve(true);
      mockCategoryService.existsByNameAsync = () => Promise.resolve(true);

      const categoryHandler = new CategoryHandler(
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.put("/:id", categoryHandler.updateCategory);

      const res = await app.request(
        new Request("http://localhost/1", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ categoryName: "coding" }),
        }),
      );
      const result = await res.json();

      assertEquals(res.status, 409);
      assertEquals(result, { error: "Category name already exists." });
    });
  });
});