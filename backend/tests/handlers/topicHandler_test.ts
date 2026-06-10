import { describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { TopicHandler } from "../../src/handlers/TopicHandler.ts";
import { TopicService } from "../../src/services/topic.service.ts";
import { CategoryService } from "../../src/services/category.service.ts";
import { Context } from "@hono/hono";
import { isValidId } from "../../src/lib/validation.ts";

type MockResponse = { status: number; data: unknown };

function createMockContext({
  queryValue,
  jsonBody,
}: {
  queryValue?: string;
  jsonBody?: unknown;
}) {
  return {
    req: {
      query: () => queryValue,
      json: () => Promise.resolve(jsonBody),
    },
    json: (data: unknown, status = 200) => ({ status, data }),
  } as unknown as Context;
}

describe("TopicHandler", () => {
  describe("getTopics", () => {
    it("should return all topics", async () => {
      const topics = [{ id: 1, name: "Java", categoryId: 1 }];

      const topicService = {
        getTopics: () => Promise.resolve(topics),
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(true),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({});

      const result = (await handler.getTopics(c)) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(result.data, topics);
    });

    it("should return 400 for invalid categoryId", async () => {
      const handler = new TopicHandler(
        {} as unknown as TopicService,
        {} as unknown as CategoryService,
      );

      const c = createMockContext({
        queryValue: "-1",
      });

      const result = (await handler.getTopics(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Invalid categoryId",
      });
    });

    it("should return 404 when category does not exist", async () => {
      const topicService = {
        getTopics: () => Promise.resolve([]),
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(false),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({
        queryValue: "1",
      });

      const result = (await handler.getTopics(c)) as unknown as MockResponse;

      assertEquals(result.status, 404);
      assertEquals(result.data, {
        error: "Category not found with Id : 1",
      });
    });

    it("should return filtered topics by category", async () => {
      const topics = [{ id: 1, name: "Java", categoryId: 1 }];

      const topicService = {
        getTopics: (categoryId: number) => {
          assertEquals(categoryId, 1);
          return Promise.resolve(topics);
        },
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(true),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({
        queryValue: "1",
      });

      const result = (await handler.getTopics(c)) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(result.data, topics);
    });

    it("should return 500 when service throws", async () => {
      const topicService = {
        getTopics: () => {
          throw new Error("DB Error");
        },
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(true),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({});

      const result = (await handler.getTopics(c)) as unknown as MockResponse;

      assertEquals(result.status, 500);
      assertEquals(result.data, {
        error: "Failed to fetch topics",
      });
    });
  });

  describe("addTopic", () => {
    it("should create a topic", async () => {
      const createdTopic = {
        id: 1,
        name: "Java",
        categoryId: 1,
      };

      const topicService = {
        getTopics: () => Promise.resolve([]),
        addTopic: (name: string, categoryId: number) => {
          assertEquals(name, "Java");
          assertEquals(categoryId, 1);

          return Promise.resolve(createdTopic);
        },
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(true),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({
        jsonBody: {
          name: "java",
          categoryId: 1,
        },
      });

      const result = (await handler.addTopic(c)) as unknown as MockResponse;

      assertEquals(result.status, 201);
      assertEquals(result.data, createdTopic);
    });

    it("should return 400 for invalid categoryId", async () => {
      const handler = new TopicHandler(
        {} as unknown as TopicService,
        {} as unknown as CategoryService,
      );

      const c = createMockContext({
        jsonBody: {
          name: "Java",
          categoryId: -1,
        },
      });

      const result = (await handler.addTopic(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Invalid categoryId",
      });
    });

    it("should return 400 for invalid topic name", async () => {
      const handler = new TopicHandler(
        {} as unknown as TopicService,
        {} as unknown as CategoryService,
      );

      const c = createMockContext({
        jsonBody: {
          name: "",
          categoryId: 1,
        },
      });

      const result = (await handler.addTopic(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Invalid topic name",
      });
    });

    it("should return 404 when category does not exist", async () => {
      const topicService = {};

      const categoryService = {
        categoryExists: () => Promise.resolve(false),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({
        jsonBody: {
          name: "Java",
          categoryId: 1,
        },
      });

      const result = (await handler.addTopic(c)) as unknown as MockResponse;

      assertEquals(result.status, 404);
      assertEquals(result.data, {
        error: "Category not found with Id : 1",
      });
    });

    it("should return 400 when topic already exists", async () => {
      const topicService = {
        getTopics: () =>
          Promise.resolve([
            {
              id: 1,
              name: "Java",
              categoryId: 1,
            },
          ]),
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(true),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({
        jsonBody: {
          name: "java",
          categoryId: 1,
        },
      });

      const result = (await handler.addTopic(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Topic already exists",
      });
    });

    it("should return 500 when addTopic throws", async () => {
      const topicService = {
        getTopics: () => Promise.resolve([]),
        addTopic: () => {
          throw new Error("DB Error");
        },
      };

      const categoryService = {
        categoryExists: () => Promise.resolve(true),
      };

      const handler = new TopicHandler(
        topicService as unknown as TopicService,
        categoryService as unknown as CategoryService,
      );

      const c = createMockContext({
        jsonBody: {
          name: "Java",
          categoryId: 1,
        },
      });

      const result = (await handler.addTopic(c)) as unknown as MockResponse;

      assertEquals(result.status, 500);
      assertEquals(result.data, {
        error: "Failed to add topic",
      });
    });
  });

  describe("categoryId validation", () => {
    it("should return true for undefined", () => {
      assertEquals(isValidId(undefined), true);
    });

    it("should return true for positive number", () => {
      assertEquals(isValidId("1"), true);
    });

    it("should return false for zero", () => {
      assertEquals(isValidId("0"), false);
    });

    it("should return false for negative number", () => {
      assertEquals(isValidId("-1"), false);
    });

    it("should return false for non-numeric value", () => {
      assertEquals(isValidId("abc"), false);
    });
  });
});
