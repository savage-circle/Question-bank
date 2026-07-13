import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { spy } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { Hono } from "@hono/hono";
import { QuestionHandler } from "../../src/handlers/QuestionHandler.ts";
import { IService } from "../../src/services/IService.ts";
import { Question, CreateQuestionDTO } from "../../src/types/question.ts";
import { Topic, CreateTopicDTO } from "../../src/types/topic.ts";
import { IValidationService } from "../../src/services/IValidationService.ts";

describe("QuestionHandler", () => {
  const mockQuestionService: IService<Question, CreateQuestionDTO> = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    createAsync: () =>
      Promise.resolve({
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        extensions: null,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      }),
    updateAsync: () =>
      Promise.resolve({
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        extensions: null,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      }),
    deleteAsync: () => Promise.resolve(),
  };

  const mockTopicService: IService<Topic, CreateTopicDTO> = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    createAsync: () =>
      Promise.resolve({ id: 1, name: "Topic 1", categoryId: 1 }),
    updateAsync: () =>
      Promise.resolve({ id: 1, name: "Topic 1", categoryId: 1 }),
    deleteAsync: () => Promise.resolve(),
  };

  const mockValidationService: IValidationService = {
    isValidWhenProvided: () => true,
    isNonEmptyString: () => true,
    isValidPositiveInteger: () => true,
    isValidEnumValue: () => true,
    isStringArray: () => true,
    validateCreateCategoryInput: (_categoryName: string) => ({ isValid: true }),
    validateUpdateCategoryInput: (_id: string | undefined, _categoryName: string) => ({ isValid: true }),
    validateQuestionUpsertInput: () => ({ isValid: true }),
    validateGetQuestionInput: () => ({ isValid: true }),
    validateGetTopicsInput: () => ({ isValid: true }),
    validateAddTopicInput: () => ({ isValid: true }),
  };

  describe("getQuestions", () => {
    it("should return all questions", async () => {
      // Arrange
      const questions = [
        {
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: null,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
        },
      ];
      const getAllAsyncSpy = spy(() => Promise.resolve(questions));
      mockQuestionService.getAllAsync = getAllAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.get("/", questionHandler.getQuestions);
      const req = new Request("http://localhost/");

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, [
        {
          id: 1,
          description: "Question 1",
          topicName: "Topic 1",
          levelName: "EASY",
          extensions: [],
        },
      ]);
      assertEquals(getAllAsyncSpy.calls.length, 1);
    });

    it("should return 400 if categoryId is invalid", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        { ...mockValidationService, validateGetQuestionInput: () => ({ isValid: false, error: "Invalid categoryId" }) }
      );

      const app = new Hono();
      app.get("/", questionHandler.getQuestions);
      const req = new Request("http://localhost/?categoryId=invalid");

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 400 if topicId is invalid", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        { ...mockValidationService, validateGetQuestionInput: () => ({ isValid: false, error: "Invalid topicId" }) }
      );
      const app = new Hono();
      app.get("/", questionHandler.getQuestions);
      const req = new Request("http://localhost/?topicId=invalid");

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 400 if levelId is invalid", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        { ...mockValidationService, validateGetQuestionInput: () => ({ isValid: false, error: "Invalid levelId" }) }
      );
      const app = new Hono();
      app.get("/", questionHandler.getQuestions);
      const req = new Request("http://localhost/?levelId=invalid");

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });
  });

  describe("addQuestion", () => {
    it("should add a new question", async () => {
      // Arrange
      const question = {
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        extensions: null,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      };
      const createAsyncSpy = spy(() => Promise.resolve(question));
      mockQuestionService.createAsync = createAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockTopicService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.post("/", questionHandler.addQuestion);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(res.status, 201);
      assertEquals(result, question);
      assertEquals(createAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 400 if validation fails", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        { ...mockValidationService, validateQuestionUpsertInput: () => ({ isValid: false, error: "Question description is required." }) }
      );
      const app = new Hono();
      app.post("/", questionHandler.addQuestion);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({
          description: "",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 404 if topic does not exist", async () => {
      // Arrange
      const existsAsyncSpy = spy(() => Promise.resolve(false));
      mockTopicService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.post("/", questionHandler.addQuestion);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });
  });

  describe("updateQuestion", () => {
    it("should update a question", async () => {
      // Arrange
      const updateAsyncSpy = spy(() =>
        Promise.resolve({
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: null,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
        })
      );
      mockQuestionService.updateAsync = updateAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockQuestionService.existsAsync = existsAsyncSpy;
      mockTopicService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, { message: "Question updated successfully." });
      assertEquals(updateAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 2);
    });

    it("should return 400 if validation fails", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        { ...mockValidationService, validateQuestionUpsertInput: () => ({ isValid: false, error: "Question description is required." }) }
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 404 if question does not exist", async () => {
      // Arrange
      const existsAsyncSpy = spy(() => Promise.resolve(false));
      mockQuestionService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 404 if topic does not exist", async () => {
      // Arrange
      const questionExistsAsyncSpy = spy(() => Promise.resolve(true));
      mockQuestionService.existsAsync = questionExistsAsyncSpy;
      const topicExistsAsyncSpy = spy(() => Promise.resolve(false));
      mockTopicService.existsAsync = topicExistsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          extensions: [],
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
      assertEquals(questionExistsAsyncSpy.calls.length, 1);
      assertEquals(topicExistsAsyncSpy.calls.length, 1);
    });
  });

  describe("deleteQuestion", () => {
    it("should delete a question", async () => {
      const deleteAsyncSpy = spy(() => Promise.resolve());
      mockQuestionService.deleteAsync = deleteAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockQuestionService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.delete("/:id", questionHandler.deleteQuestion);
      const req = new Request("http://localhost/1", {
        method: "DELETE",
      });

      const res = await app.request(req);
      const result = await res.json();

      assertEquals(result, { message: "Question deleted successfully." });
      assertEquals(deleteAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 404 if question does not exist", async () => {
      const existsAsyncSpy = spy(() => Promise.resolve(false));
      mockQuestionService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.delete("/:id", questionHandler.deleteQuestion);
      const req = new Request("http://localhost/1", {
        method: "DELETE",
      });

      const res = await app.request(req);

      assertEquals(res.status, 404);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 500 if deletion fails or connection failed", async () => {
      const deleteAsyncSpy = spy(() => Promise.reject(new Error("Deletion failed")));
      mockQuestionService.deleteAsync = deleteAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockQuestionService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService
      );
      const app = new Hono();
      app.delete("/:id", questionHandler.deleteQuestion);
      const req = new Request("http://localhost/1", {
        method: "DELETE",
      });

      const res = await app.request(req);
      const result = await res.json();

      assertEquals(res.status, 500);
      assertEquals(result, { error: "Failed to delete question" });
      assertEquals(deleteAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });
  });
});
