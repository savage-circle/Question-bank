import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { TopicService } from "../../src/services/TopicService.ts";
import { MockPrisma } from "../mocks/prisma.ts";

describe("TopicService", () => {
  describe("getAllAsync", () => {
    it("should return all topics", async () => {
      // Arrange
      const topics = [{ id: 1, name: "Topic 1", categoryId: 1 }];
      const prisma = MockPrisma.create({
        topic: {
          findMany: () => Promise.resolve(topics),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.getAllAsync();

      // Assert
      assertEquals(result, topics);
    });

    it("should return topics by categoryId", async () => {
      // Arrange
      const topics = [{ id: 1, name: "Topic 1", categoryId: 1 }];
      const prisma = MockPrisma.create({
        topic: {
          findMany: () => Promise.resolve(topics),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.getAllAsync({ categoryId: 1 });

      // Assert
      assertEquals(result, topics);
    });
  });

  describe("getByIdAsync", () => {
    it("should return a topic by id", async () => {
      // Arrange
      const topic = { id: 1, name: "Topic 1", categoryId: 1 };
      const prisma = MockPrisma.create({
        topic: {
          findUnique: () => Promise.resolve(topic),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.getByIdAsync(1);

      // Assert
      assertEquals(result, topic);
    });
  });

  describe("existsAsync", () => {
    it("should return true if a topic exists", async () => {
      // Arrange
      const topic = { id: 1, name: "Topic 1", categoryId: 1 };
      const prisma = MockPrisma.create({
        topic: {
          findUnique: () => Promise.resolve(topic),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.existsAsync(1);

      // Assert
      assertEquals(result, true);
    });

    it("should return false if a topic does not exist", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        topic: {
          findUnique: () => Promise.resolve(null),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.existsAsync(1);

      // Assert
      assertEquals(result, false);
    });
  });

  describe("createAsync", () => {
    it("should create a new topic", async () => {
      // Arrange
      const topic = { id: 1, name: "Topic 1", categoryId: 1 };
      const prisma = MockPrisma.create({
        topic: {
          create: () => Promise.resolve(topic),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.createAsync({
        name: "Topic 1",
        categoryId: 1,
      });

      // Assert
      assertEquals(result, topic);
    });
  });

  describe("updateAsync", () => {
    it("should update a topic", async () => {
      // Arrange
      const topic = { id: 1, name: "Topic 1", categoryId: 1 };
      const prisma = MockPrisma.create({
        topic: {
          update: () => Promise.resolve(topic),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      const result = await topicService.updateAsync(1, {
        name: "Topic 1",
        categoryId: 1,
      });

      // Assert
      assertEquals(result, topic);
    });
  });

  describe("deleteAsync", () => {
    it("should delete a topic", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        topic: {
          delete: () => Promise.resolve(),
        },
      });
      const topicService = new TopicService(prisma);

      // Act
      await topicService.deleteAsync(1);

      // Assert
      // No assertion needed, just checking that it doesn't throw
    });
  });
});