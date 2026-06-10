import { describe, it } from "@std/testing";
import { assertEquals } from "@std/assert";
import { QuestionHandler } from "../../src/handlers/QuestionHandler.ts";
import { QuestionService } from "../../src/services/question.service.ts";
import { Context } from "@hono/hono";
import { TopicService } from "../../src/services/topic.service.ts";

type MockResponse = { status: number; data: unknown };

// Factory function to create test questions with optional overrides
function createTestQuestion(overrides?: Record<string, unknown>) {
  return {
    id: 101,
    description: "Explain the concept of polymorphism.",
    topicId: 4,
    levelId: 2,
    extensions: JSON.stringify([
      "Provide a real-world example.",
      "Compare runtime and compile-time polymorphism.",
    ]),
    topic: { id: 4, name: "OOPs", categoryId: 1 },
    ...overrides,
  };
}

// Factory function to create mock QuestionService with optional overrides
function createQuestionServiceMock(
  overrides?: Partial<QuestionService>,
): QuestionService {
  return {
    getQuestions: () => Promise.resolve([]),
    ...overrides,
  } as QuestionService;
}

// Factory function to create mock TopicService with optional overrides
function createTopicServiceMock(
  overrides?: Partial<TopicService>,
): TopicService {
  return {
    isTopicExists: () => Promise.resolve(true),
    ...overrides,
  } as TopicService;
}

// Create mock context with flexible typing
function createMockContext(
  query: Record<string, string> = {},
  params: Record<string, string> = {},
  jsonBody?: Record<string, unknown>,
) {
  return {
    req: {
      query: (key: string) => query[key],
      param: (key: string) => params[key],
      json: () => Promise.resolve(jsonBody || {}),
    },
    json: (data: unknown, status = 200) => ({
      status,
      data,
    }),
    body: (_data: unknown, status = 200) => ({
      status,
      data: null,
    }),
  } as unknown as Context;
}

// Helper to create handler with sensible defaults
function createHandler(
  questionService?: Partial<QuestionService>,
  topicService?: Partial<TopicService>,
): QuestionHandler {
  return new QuestionHandler(
    createQuestionServiceMock(questionService),
    createTopicServiceMock(topicService),
  );
}

describe("QuestionHandler", () => {
  describe("getQuestions", () => {
    it("should return questions mapped with topicName, levelName and parsed extensions", async () => {
      const handler = createHandler({
        getQuestions: () => Promise.resolve([createTestQuestion()]),
      });

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
      const handler = createHandler({
        getQuestions: () =>
          Promise.resolve([createTestQuestion({ extensions: null })]),
      });

      const c = createMockContext();
      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(
        (result.data as { extensions: string[] }[])[0].extensions,
        [],
      );
    });

    it("should pass parsed filters to the service", async () => {
      const filters: unknown[] = [];
      const handler = createHandler({
        getQuestions: (f: unknown) => {
          filters.push(f);
          assertEquals(f, { categoryId: 1, topicId: 4, levelId: 2 });
          return Promise.resolve([]);
        },
      });

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
      const handler = createHandler({
        getQuestions: (f: unknown) => {
          assertEquals(f, {
            categoryId: undefined,
            topicId: undefined,
            levelId: undefined,
          });
          return Promise.resolve([]);
        },
      });

      const result = (await handler.getQuestions(
        createMockContext(),
      )) as unknown as MockResponse;

      assertEquals(result.status, 200);
    });

    it("should return 400 for invalid categoryId", async () => {
      const handler = createHandler();
      const c = createMockContext({ categoryId: "-1" });
      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, { error: "Invalid categoryId" });
    });

    it("should return 400 for invalid topicId", async () => {
      const handler = createHandler();
      const c = createMockContext({ topicId: "abc" });
      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, { error: "Invalid topicId" });
    });

    it("should return 400 for invalid levelId", async () => {
      const handler = createHandler();
      const c = createMockContext({ levelId: "0" });
      const result = (await handler.getQuestions(c)) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, { error: "Invalid levelId" });
    });

    it("should return 500 when the service throws", async () => {
      const handler = createHandler({
        getQuestions: () => {
          throw new Error("DB Error");
        },
      });

      const result = (await handler.getQuestions(
        createMockContext(),
      )) as unknown as MockResponse;

      assertEquals(result.status, 500);
      assertEquals(result.data, { error: "Failed to fetch questions" });
    });
  });

  describe("isValidId", () => {
    const handler = createHandler();

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
    const handler = createHandler();

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
    const handler = createHandler();

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

  describe("updateQuestion", () => {
    it("should return an error response if the service throws", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.reject(new Error("DB Error")),
      });

      const c = createMockContext(
        {},
        { id: "10" },
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 500);
      assertEquals(result.data, { error: "Failed to update question" });
    });

    it("should return the updated question on success", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.resolve(),
      });

      const c = createMockContext(
        {},
        { id: "10" },
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 200);
      assertEquals(result.data, {
        message: "Question updated successfully.",
      });
    });

    it("should return an error response if the question ID is not existing", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(false),
        updateQuestion: () => Promise.resolve(),
      });

      const c = createMockContext(
        {},
        { id: "11" },
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 404);
      assertEquals(result.data, { error: "Question does not exist." });
    });

    it("should return an error response if the topic ID is invalid", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.resolve(),
      });

      const c = createMockContext(
        {},
        { id: "11" },
        {
          description: "desc",
          topicId: -1,
          levelId: 1,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Invalid topic id.",
      });
    });

    it("should return an error response if the topic ID is not existing", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.resolve(),
      }, {
        isTopicExists: () => Promise.resolve(false),
      });

      const c = createMockContext(
        {},
        { id: "11" },
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 404);

      assertEquals(result.data, { error: "Topic does not exist." });
    });

    it("should return an error response if the description is empty", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.resolve(),
      }, {
        isTopicExists: () => Promise.resolve(true),
      });

      const c = createMockContext(
        {},
        { id: "11" },
        {
          description: "   ",
          topicId: 1,
          levelId: 1,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;
      assertEquals(result.status, 400);

      assertEquals(result.data, { error: "Question description is required." });
    });

    it("should return an error response if the levelId is invalid", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.resolve(),
      });

      const c = createMockContext(
        {},
        { id: "11" },
        {
          description: "desc",
          topicId: 1,
          levelId: 101,
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "LevelId should be valid enum value",
      });
    });

    it("should return an error response if the extensions is not an array", async () => {
      const handler = createHandler({
        isQuestionExists: () => Promise.resolve(true),
        updateQuestion: () => Promise.resolve(),
      });

      const c = createMockContext(
        {},
        { id: "11" },
        {
          description: "desc",
          topicId: 1,
          levelId: 1,
          extensions: "not an array" as unknown as string[],
        },
      );
      const result = (await handler.updateQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Extensions should be an array of non-empty strings.",
      });
    });
  });

  describe("deleteQuestion", () => {
    it("should return 400 when question id is invalid", async () => {
      const handler = new QuestionHandler(
        {} as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({ id: "abc" });

      const result = (await handler.deleteQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 400);
      assertEquals(result.data, {
        error: "Invalid question ID",
      });
    });

    it("should return 204 when question is deleted successfully", async () => {
      const questionService = {
        deleteQuestion: (_id: number) => Promise.resolve({}),
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({ id: "1" });

      const result = await handler.deleteQuestion(c);

      assertEquals((result as unknown as MockResponse).status, 204);
    });

    it("should pass the question id to the service", async () => {
      const questionService = {
        deleteQuestion: (id: number) => {
          assertEquals(id, 123);

          return Promise.resolve({
            id: 123,
          });
        },
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      await handler.deleteQuestion(createMockContext({ id: "123" }));
    });

    it("should return 404 when the question does not exist", async () => {
      const questionService = {
        deleteQuestion: () => {
          throw new Error("Question not found");
        },
      };

      const handler = new QuestionHandler(
        questionService as unknown as QuestionService,
        {} as unknown as TopicService,
      );

      const c = createMockContext({ id: "1" });

      const result = (await handler.deleteQuestion(
        c,
      )) as unknown as MockResponse;

      assertEquals(result.status, 404);
      assertEquals(result.data, {
        error: "Question does not exist",
      });
    });
  });
});
