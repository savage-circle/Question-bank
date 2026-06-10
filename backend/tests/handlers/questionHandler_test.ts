import { describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { QuestionHandler } from "../../src/handlers/QuestionHandler.ts";
import { QuestionService } from "../../src/services/question.service.ts";
import { Context } from "@hono/hono";
import { TopicService } from "../../src/services/topic.service.ts";

type MockResponse = { status: number; data: unknown };

function createMockContext(
  query: Record<string, string> = {},
  params: Record<string, string> = {},
) {
  return {
    req: {
      query: (key: string) => query[key],
      param: (key: string) => params[key],
      json: () => Promise.resolve({}),
    },
    json: (data: unknown, status = 200) => ({ status, data }),
  } as unknown as Context;
}

const questionWithTopic = {
  id: 101,
  description: "Explain the concept of polymorphism.",
  topicId: 4,
  levelId: 2,
  extensions: JSON.stringify([
    "Provide a real-world example.",
    "Compare runtime and compile-time polymorphism.",
  ]),
  topic: { id: 4, name: "OOPs", categoryId: 1 },
};

describe("QuestionHandler", () => {
  describe("getQuestions", () => {
    it("should return questions mapped with topicName, levelName and parsed extensions", async () => {
      const questionService = {
        getQuestions: () => Promise.resolve([questionWithTopic]),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext();

      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(result.data, [
        {
          id: 101,
          description: "Explain the concept of polymorphism.",
          topicName: "OOPs",
          levelName: "MEDIUM",
          extensions: [
            "Provide a real-world example.",
            "Compare runtime and compile-time polymorphism.",
          ],
        },
      ]);
    });

    it("should return an empty extensions array when extensions is null", async () => {
      const questionService = {
        getQuestions: () =>
          Promise.resolve([{ ...questionWithTopic, extensions: null }]),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext();

      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(
        (result.data as { extensions: string[] }[])[0].extensions,
        [],
      );
    });

    it("should pass parsed filters to the service", async () => {
      const questionService = {
        getQuestions: (filters: unknown) => {
          assertEquals(filters, { categoryId: 1, topicId: 4, levelId: 2 });
          return Promise.resolve([]);
        },
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({
        categoryId: "1",
        topicId: "4",
        levelId: "2",
      });

      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(result.data, []);
    });

    it("should pass undefined filters when no query params are provided", async () => {
      const questionService = {
        getQuestions: (filters: unknown) => {
          assertEquals(filters, {
            categoryId: undefined,
            topicId: undefined,
            levelId: undefined,
          });
          return Promise.resolve([]);
        },
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const result = (await handler.getQuestions(
        createMockContext(),
      )) as unknown as MockResponse;

      assertEquals(result.status, 200);
    });

    it("should return 400 for invalid categoryId", async () => {
      const handler = new QuestionHandler(
        {} as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({ categoryId: "-1" });

      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, { error: "Invalid categoryId" });
    });

    it("should return 400 for invalid topicId", async () => {
      const handler = new QuestionHandler(
        {} as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({ topicId: "abc" });

      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, { error: "Invalid topicId" });
    });

    it("should return 400 for invalid levelId", async () => {
      const handler = new QuestionHandler(
        {} as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({ levelId: "0" });

      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, { error: "Invalid levelId" });
    });

    it("should return 500 when the service throws", async () => {
      const questionService = {
        getQuestions: () => {
          throw new Error("DB Error");
        },
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const result = (await handler.getQuestions(
        createMockContext(),
      )) as unknown as MockResponse;

      assertEquals(result.status, 500);
      assertEquals(result.data, { error: "Failed to fetch questions" });
    });
  });

  describe("isValidId", () => {
    const handler = new QuestionHandler(
      {} as unknown as QuestionService,
      {} as unknown as TopicService,
    );

    it("should return true for undefined", () => {
      assertEquals(handler.isValidId(undefined), true);
    });

    it("should return true for a positive number", () => {
      assertEquals(handler.isValidId("1"), true);
    });

    it("should return false for zero", () => {
      assertEquals(handler.isValidId("0"), false);
    });

    it("should return false for a negative number", () => {
      assertEquals(handler.isValidId("-1"), false);
    });

    it("should return false for a non-numeric value", () => {
      assertEquals(handler.isValidId("abc"), false);
    });
  });

  describe("getLevelName", () => {
    const handler = new QuestionHandler(
      {} as unknown as QuestionService,
      {} as unknown as TopicService,
    );

    it("should map level ids to enum names", () => {
      assertEquals(handler.getLevelName(1), "EASY");
      assertEquals(handler.getLevelName(2), "MEDIUM");
      assertEquals(handler.getLevelName(3), "HARD");
    });

    it("should return UNKNOWN for an unmapped level id", () => {
      assertEquals(handler.getLevelName(99), "UNKNOWN");
    });
  });

  describe("parseExtensions", () => {
    const handler = new QuestionHandler(
      {} as unknown as QuestionService,
      {} as unknown as TopicService,
    );

    it("should return an empty array for null", () => {
      assertEquals(handler.parseExtensions(null), []);
    });

    it("should parse a stringified JSON array", () => {
      assertEquals(handler.parseExtensions('["a","b"]'), ["a", "b"]);
    });

    it("should return an empty array for invalid JSON", () => {
      assertEquals(handler.parseExtensions("not json"), []);
    });

    it("should return an empty array when the JSON is not an array", () => {
      assertEquals(handler.parseExtensions('{"a":1}'), []);
    });
  });

  describe("updateQuestionValidator", () => {
    const topicService = {
      isTopicExists: () => Promise.resolve(true),
    };
    const handler = new QuestionHandler(
      {} as unknown as QuestionService,
      topicService as unknown as TopicService,
    );

    it("should return an error response if the question ID is invalid", async () => {
      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(c, -1, {
        description: "desc",
        topicId: 1,
        levelId: 1,
      })) as unknown as MockResponse;

      assertEquals(result.data, { error: "Invalid question ID." });
    });

    it("should return an error response if the question ID is not a number", async () => {
      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        "abc" as unknown as number,
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, { error: "Invalid question ID." });
    });

    it("should return an error response if the question ID is not existing", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(false),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, { error: "Question does not exist." });
    });

    it("should retunn an error response if the topic ID is invalid", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: -1,
          levelId: 1,
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, {
        error: "Invalid topic id or TopicId is required",
      });
    });

    it("should return an error response if the topic ID is not existing", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const topicService = {
        isTopicExists: () => Promise.resolve(false),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: 10,
          levelId: 1,
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, { error: "Topic does not exist." });
    });

    it("should return an error response if the description is empty", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "   ",
          topicId: 1,
          levelId: 1,
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, { error: "Question description is required." });
    });

    it("should return an error response if the levelId is invalid", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: 1,
          levelId: 99,
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, {
        error: "LevelId should be valid enum value",
      });
    });

    it("should return an error response if the extensions is not an array", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
          extensions: "not an array" as unknown as string[],
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, { error: "Extensions must be an array." });
    });

    it("should return an error response if any extension value is an empty string", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = (await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
          extensions: ["valid extension", "   "] as unknown as string[],
        },
      )) as unknown as MockResponse;

      assertEquals(result.data, {
        error: "Extension values must be non-empty strings.",
      });
    });

    it("should return null if all validations pass", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
      };

      const topicService = {
        isTopicExists: () => Promise.resolve(true),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );

      const c = createMockContext();
      const result = await handler.updateQuestionValidator(
        c,
        10 as unknown as number,
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
          extensions: ["ext1", "ext2"] as unknown as string[],
        },
      );

      assertEquals(result, null);
    });
  });

  describe("updateQuestion", () => {
    const topicService = {
      isTopicExists: () => Promise.resolve(true),
    };

    it("should return an error response if the service throws", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
        updateQuestionValidator: () => Promise.resolve(null),
        updateQuestion: () => Promise.reject(new Error("DB Error")),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );
      const c = createMockContext({}, { id: "10" });
      (c.req.json as any) = () =>
        Promise.resolve({
          description: "desc",
          topicId: 1,
          levelId: 1,
        });
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 500);
      assertEquals(result.data, { error: "Failed to update question" });
    });

    it("should return the updated question on success", async () => {
      const questionService = {
        isQuestionExists: () => Promise.resolve(true),
        updateQuestionValidator: () => Promise.resolve(null),
        updateQuestion: () => Promise.resolve({}),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        topicService as unknown as TopicService,
      );
      const c = createMockContext({}, { id: "10" });
      (c.req.json as any) = () =>
        Promise.resolve({
          description: "desc",
          topicId: 1,
          levelId: 1,
        });
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(result.data, {
        message: "Question updated successfully.",
      });
    });
  });
});
