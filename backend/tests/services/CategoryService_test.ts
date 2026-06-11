import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { CategoryService } from "../../src/services/CategoryService.ts";
import { MockPrisma } from "../mocks/prisma.ts";

describe("CategoryService", () => {
  describe("getAllAsync", () => {
    it("should return all categories", async () => {
      // Arrange
      const categories = [{ id: 1, name: "Category 1" }];
      const prisma = MockPrisma.create({
        category: {
          findMany: () => Promise.resolve(categories),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      const result = await categoryService.getAllAsync();

      // Assert
      assertEquals(result, categories);
    });
  });

  describe("getByIdAsync", () => {
    it("should return a category by id", async () => {
      // Arrange
      const category = { id: 1, name: "Category 1" };
      const prisma = MockPrisma.create({
        category: {
          findUnique: () => Promise.resolve(category),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      const result = await categoryService.getByIdAsync(1);

      // Assert
      assertEquals(result, category);
    });
  });

  describe("existsAsync", () => {
    it("should return true if a category exists", async () => {
      // Arrange
      const category = { id: 1, name: "Category 1" };
      const prisma = MockPrisma.create({
        category: {
          findUnique: () => Promise.resolve(category),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      const result = await categoryService.existsAsync(1);

      // Assert
      assertEquals(result, true);
    });

    it("should return false if a category does not exist", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        category: {
          findUnique: () => Promise.resolve(null),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      const result = await categoryService.existsAsync(1);

      // Assert
      assertEquals(result, false);
    });
  });

  describe("createAsync", () => {
    it("should create a new category", async () => {
      // Arrange
      const category = { id: 1, name: "Category 1" };
      const prisma = MockPrisma.create({
        category: {
          create: () => Promise.resolve(category),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      const result = await categoryService.createAsync({ name: "Category 1" });

      // Assert
      assertEquals(result, category);
    });
  });

  describe("updateAsync", () => {
    it("should update a category", async () => {
      // Arrange
      const category = { id: 1, name: "Category 1" };
      const prisma = MockPrisma.create({
        category: {
          update: () => Promise.resolve(category),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      const result = await categoryService.updateAsync(1, {
        name: "Category 1",
      });

      // Assert
      assertEquals(result, category);
    });
  });

  describe("deleteAsync", () => {
    it("should delete a category", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        category: {
          delete: () => Promise.resolve(),
        },
      });
      const categoryService = new CategoryService(prisma);

      // Act
      await categoryService.deleteAsync(1);

      // Assert
      // No assertion needed, just checking that it doesn't throw
    });
  });
});