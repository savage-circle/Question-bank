import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { spy } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { Hono } from "@hono/hono";
import { QuestionHandler } from "../../src/handlers/QuestionHandler.ts";
import { IService } from "../../src/services/IService.ts";
import { IQuestionService } from "../../src/services/IQuestionService.ts";
import { Topic, CreateTopicDTO } from "../../src/types/topic.ts";
import { createMockValidationService } from "../mocks/validationService.ts";
import { Prisma } from "../../src/generated/prisma/client.ts";
import { Messages } from "../../src/constants.ts";

describe("QuestionHandler", () => {
  const mockQuestionService: IQuestionService = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    createAsync: () =>
      Promise.resolve({
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
        followUps: [],
      }),
    updateAsync: () =>
      Promise.resolve({
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
        followUps: [],
      }),
    deleteAsync: () => Promise.resolve(),
    getFollowUpsAsync: () => Promise.resolve([]),
    followUpExistsAsync: () => Promise.resolve(true),
    addFollowUpAsync: () =>
      Promise.resolve({
        id: 1,
        levelId: 1,
        description: "Follow up",
        question: "Next?",
      }),
    updateFollowUpAsync: () =>
      Promise.resolve({
        id: 1,
        levelId: 1,
        description: "Follow up",
        question: "Next?",
      }),
    deleteFollowUpAsync: () => Promise.resolve(),
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

  const mockValidationService = createMockValidationService();

  describe("getQuestions", () => {
    it("should return all questions", async () => {
      // Arrange
      const questions = [
        {
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
          followUps: [
            {
              id: 1,
              levelId: 1,
              description: "Follow-up description",
              question: "What next?",
            },
          ],
        },
      ];
      const getAllAsyncSpy = spy(() => Promise.resolve(questions));
      mockQuestionService.getAllAsync = getAllAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
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
          followUps: [
            {
              id: 1,
              levelId: 1,
              description: "Follow-up description",
              question: "What next?",
            },
          ],
        },
      ]);
      assertEquals(getAllAsyncSpy.calls.length, 1);
    });

    it("should return 400 if categoryId is invalid", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        createMockValidationService({
          validateGetQuestionInput: () => ({
            isValid: false,
            error: Messages.InvalidCategoryIdParam,
          }),
        }),
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
        createMockValidationService({
          validateGetQuestionInput: () => ({
            isValid: false,
            error: Messages.InvalidTopicIdParam,
          }),
        }),
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
        createMockValidationService({
          validateGetQuestionInput: () => ({
            isValid: false,
            error: Messages.InvalidLevelIdParam,
          }),
        }),
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
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
        followUps: [],
      };
      const createAsyncSpy = spy(() => Promise.resolve(question));
      mockQuestionService.createAsync = createAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockTopicService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", questionHandler.addQuestion);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
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
        createMockValidationService({
          validateQuestionUpsertInput: () => ({
            isValid: false,
            error: Messages.QuestionDescriptionRequired,
          }),
        }),
      );
      const app = new Hono();
      app.post("/", questionHandler.addQuestion);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({
          description: "",
          topicId: 1,
          levelId: 1,
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
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", questionHandler.addQuestion);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
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
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
          followUps: [],
        }),
      );
      mockQuestionService.updateAsync = updateAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockQuestionService.existsAsync = existsAsyncSpy;
      mockTopicService.existsAsync = existsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
        }),
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, { message: Messages.QuestionUpdated });
      assertEquals(updateAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 2);
    });

    it("should return 400 if validation fails", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        createMockValidationService({
          validateQuestionUpsertInput: () => ({
            isValid: false,
            error: Messages.QuestionDescriptionRequired,
          }),
        }),
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "",
          topicId: 1,
          levelId: 1,
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
        mockValidationService,
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
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
        mockValidationService,
      );
      const app = new Hono();
      app.put("/:id", questionHandler.updateQuestion);
      const req = new Request("http://localhost/1", {
        method: "PUT",
        body: JSON.stringify({
          description: "Question 1",
          topicId: 1,
          levelId: 1,
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

  describe("getQuestionFollowUps", () => {
    it("should return follow-ups for a question", async () => {
      // Arrange
      const followUps = [
        {
          id: 1,
          levelId: 1,
          description: "Follow up",
          question: "Next?",
        },
      ];
      mockQuestionService.existsAsync = () => Promise.resolve(true);
      const getFollowUpsAsyncSpy = spy(() => Promise.resolve(followUps));
      mockQuestionService.getFollowUpsAsync = getFollowUpsAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.get("/:id/follow-ups", questionHandler.getQuestionFollowUps);
      const req = new Request("http://localhost/1/follow-ups");

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, followUps);
      assertEquals(getFollowUpsAsyncSpy.calls.length, 1);
    });

    it("should return 404 if question does not exist", async () => {
      // Arrange
      mockQuestionService.existsAsync = () => Promise.resolve(false);
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.get("/:id/follow-ups", questionHandler.getQuestionFollowUps);
      const req = new Request("http://localhost/1/follow-ups");

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
    });
  });

  describe("addQuestionFollowUp", () => {
    it("should create a follow-up", async () => {
      // Arrange
      mockQuestionService.existsAsync = () => Promise.resolve(true);
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/:id/follow-ups", questionHandler.addQuestionFollowUp);
      const req = new Request("http://localhost/1/follow-ups", {
        method: "POST",
        body: JSON.stringify({
          levelId: 1,
          description: "Follow up",
          question: "Next?",
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 201);
    });

    it("should return 400 if validation fails", async () => {
      // Arrange
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        createMockValidationService({
          validateFollowUpUpsertInput: () => ({
            isValid: false,
            error: Messages.FollowUpDescriptionRequired,
          }),
        }),
      );
      const app = new Hono();
      app.post("/:id/follow-ups", questionHandler.addQuestionFollowUp);
      const req = new Request("http://localhost/1/follow-ups", {
        method: "POST",
        body: JSON.stringify({
          levelId: 1,
          description: "",
          question: "Next?",
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 404 when question does not exist", async () => {
      // Arrange
      mockQuestionService.existsAsync = () => Promise.resolve(false);
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/:id/follow-ups", questionHandler.addQuestionFollowUp);
      const req = new Request("http://localhost/1/follow-ups", {
        method: "POST",
        body: JSON.stringify({
          levelId: 1,
          description: "Follow up",
          question: "Next?",
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
    });
  });

  describe("updateQuestionFollowUp", () => {
    it("should update a follow-up", async () => {
      // Arrange
      const updateFollowUpAsyncSpy = spy(() =>
        Promise.resolve({
          id: 1,
          levelId: 1,
          description: "Updated",
          question: "Updated?",
        }),
      );
      mockQuestionService.updateFollowUpAsync = updateFollowUpAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.put(
        "/:id/follow-ups/:followUpId",
        questionHandler.updateQuestionFollowUp,
      );
      const req = new Request("http://localhost/1/follow-ups/1", {
        method: "PUT",
        body: JSON.stringify({
          levelId: 1,
          description: "Updated",
          question: "Updated?",
        }),
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, { message: Messages.FollowUpUpdated });
      assertEquals(updateFollowUpAsyncSpy.calls.length, 1);
    });

    it("should return 404 if follow-up does not exist", async () => {
      // Arrange
      mockQuestionService.updateFollowUpAsync = () =>
        Promise.reject(
          new Prisma.PrismaClientKnownRequestError("Record not found", {
            code: "P2025",
            clientVersion: "1.0",
          }),
        );
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.put(
        "/:id/follow-ups/:followUpId",
        questionHandler.updateQuestionFollowUp,
      );
      const req = new Request("http://localhost/1/follow-ups/1", {
        method: "PUT",
        body: JSON.stringify({
          levelId: 1,
          description: "Updated",
          question: "Updated?",
        }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
    });
  });

  describe("deleteQuestionFollowUp", () => {
    it("should delete a follow-up", async () => {
      // Arrange
      const deleteFollowUpAsyncSpy = spy(() => Promise.resolve());
      mockQuestionService.deleteFollowUpAsync = deleteFollowUpAsyncSpy;
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.delete(
        "/:id/follow-ups/:followUpId",
        questionHandler.deleteQuestionFollowUp,
      );
      const req = new Request("http://localhost/1/follow-ups/1", {
        method: "DELETE",
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, { message: Messages.FollowUpDeleted });
      assertEquals(deleteFollowUpAsyncSpy.calls.length, 1);
    });

    it("should return 404 if follow-up does not exist", async () => {
      // Arrange
      mockQuestionService.deleteFollowUpAsync = () =>
        Promise.reject(
          new Prisma.PrismaClientKnownRequestError("Record not found", {
            code: "P2025",
            clientVersion: "1.0",
          }),
        );
      const questionHandler = new QuestionHandler(
        mockQuestionService,
        mockTopicService,
        mockValidationService,
      );
      const app = new Hono();
      app.delete(
        "/:id/follow-ups/:followUpId",
        questionHandler.deleteQuestionFollowUp,
      );
      const req = new Request("http://localhost/1/follow-ups/1", {
        method: "DELETE",
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
    });
  });
});
