import { assertEquals, assertExists } from "@std/assert";
import { describe, it } from "@std/testing";
import { TopicService } from "../../src/services/topic.service.ts";
import { PrismaClient } from "../../src/generated/prisma/client.ts";

describe("TopicService", () => {
  describe("getTopics", () => {
    it("should return all topics when categoryId is not provided", async () => {
      const topics = [
        { id: 1, name: "Topic 1", categoryId: 1 },
        { id: 2, name: "Topic 2", categoryId: 2 },
      ];

      const prisma = {
        Topic: {
          findMany: () => Promise.resolve(topics),
        },
      } as unknown as PrismaClient;

      const service = new TopicService(prisma);

      const result = await service.getTopics();

      assertEquals(result, topics);
    });

    it("should filter topics by categoryId", async () => {
      const topics = [{ id: 1, name: "Topic 1", categoryId: 1 }];

      const findManySpy = (args: unknown) => {
        assertEquals(args, {
          where: {
            categoryId: 1,
          },
        });

        return Promise.resolve(topics);
      };

      const prisma = {
        Topic: {
          findMany: findManySpy,
        },
      } as unknown as PrismaClient;

      const service = new TopicService(prisma);

      const result = await service.getTopics(1);

      assertEquals(result, topics);
    });
  });

  describe("addTopic", () => {
    it("should create a topic", async () => {
      const createdTopic = {
        id: 1,
        name: "New Topic",
        categoryId: 2,
      };

      const createSpy = (args: unknown) => {
        assertEquals(args, {
          data: {
            name: "New Topic",
            categoryId: 2,
          },
        });

        return Promise.resolve(createdTopic);
      };

      const prisma = {
        Topic: {
          create: createSpy,
        },
      } as unknown as PrismaClient;

      const service = new TopicService(prisma);

      const result = await service.addTopic("New Topic", 2);

      assertEquals(result, createdTopic);
    });

    it("should return the created topic", async () => {
      const prisma = {
        Topic: {
          create: () =>
            Promise.resolve({
              id: 10,
              name: "Testing",
              categoryId: 5,
            }),
        },
      } as unknown as PrismaClient;

      const service = new TopicService(prisma);

      const result = await service.addTopic("Testing", 5);

      assertExists(result);
      assertEquals(result.id, 10);
      assertEquals(result.name, "Testing");
      assertEquals(result.categoryId, 5);
    });
  });
});
