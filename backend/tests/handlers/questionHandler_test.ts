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
      // Arrange
      const deleteAsyncSpy = spy(() => Promise.resolve());
      mockQuestionService.deleteAsync = deleteAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockQuestionService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
      );
      const app = new Hono();
      app.delete("/:id", questionHandler.deleteQuestion);
      const req = new Request("http://localhost/1", {
        method: "DELETE",
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, { message: "Question deleted successfully." });
      assertEquals(deleteAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 400 if questionId is invalid", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
      );
      const app = new Hono();
      app.delete("/:id", questionHandler.deleteQuestion);
      const req = new Request("http://localhost/invalid", {
        method: "DELETE",
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
      );
      const app = new Hono();
      app.delete("/:id", questionHandler.deleteQuestion);
      const req = new Request("http://localhost/1", {
        method: "DELETE",
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });
  });
});
