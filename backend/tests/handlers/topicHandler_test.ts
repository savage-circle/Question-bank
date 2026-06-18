import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { spy } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { Hono } from "@hono/hono";
import { TopicHandler } from "../../src/handlers/TopicHandler.ts";
import { IService } from "../../src/services/IService.ts";
import { Topic, CreateTopicDTO } from "../../src/types/topic.ts";
import { Category, CreateCategoryDTO } from "../../src/types/category.ts";
import { IValidationService } from "../../src/services/IValidationService.ts";

describe("TopicHandler", () => {
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

  const mockCategoryService: IService<Category, CreateCategoryDTO> = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    createAsync: () => Promise.resolve({ id: 1, name: "Category 1" }),
    updateAsync: () => Promise.resolve({ id: 1, name: "Category 1" }),
    deleteAsync: () => Promise.resolve(),
  };

  const mockValidationService: IValidationService = {
    isValidWhenProvided: () => true,
    isNonEmptyString: () => true,
    isValidPositiveInteger: () => true,
    isValidEnumValue: () => true,
    isStringArray: () => true,
  };

  describe("getTopics", () => {
    it("should return all topics", async () => {
      // Arrange
      const topics = [{ id: 1, name: "Topic 1", categoryId: 1 }];
      const getAllAsyncSpy = spy(() => Promise.resolve(topics));
      mockTopicService.getAllAsync = getAllAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.get("/", topicHandler.getTopics);
      const req = new Request("http://localhost/");

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, topics);
      assertEquals(getAllAsyncSpy.calls.length, 1);
    });

    it("should return topics by categoryId", async () => {
      // Arrange
      const topics = [{ id: 1, name: "Topic 1", categoryId: 1 }];
      const getAllAsyncSpy = spy(() => Promise.resolve(topics));
      mockTopicService.getAllAsync = getAllAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockCategoryService.existsAsync = existsAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.get("/", topicHandler.getTopics);
      const req = new Request("http://localhost/?categoryId=1");

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, topics);
      assertEquals(getAllAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 400 if categoryId is invalid", async () => {
      // Arrange
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        { ...mockValidationService, isValidWhenProvided: () => false },
      );
      const app = new Hono();
      app.get("/", topicHandler.getTopics);
      const req = new Request("http://localhost/?categoryId=invalid");

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 404 if category does not exist", async () => {
      // Arrange
      const existsAsyncSpy = spy(() => Promise.resolve(false));
      mockCategoryService.existsAsync = existsAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.get("/", topicHandler.getTopics);
      const req = new Request("http://localhost/?categoryId=1");

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });
  });

  describe("addTopic", () => {
    it("should add a new topic", async () => {
      // Arrange
      const topic = { id: 1, name: "Topic 1", categoryId: 1 };
      const createAsyncSpy = spy(() => Promise.resolve(topic));
      mockTopicService.createAsync = createAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockCategoryService.existsAsync = existsAsyncSpy;
      const getAllAsyncSpy = spy(() => Promise.resolve([]));
      mockTopicService.getAllAsync = getAllAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", topicHandler.addTopic);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({ name: "Topic 1", categoryId: "1" }),
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(res.status, 201);
      assertEquals(result, topic);
      assertEquals(createAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
      assertEquals(getAllAsyncSpy.calls.length, 1);
    });

    it("should return 400 if categoryId is invalid", async () => {
      // Arrange
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        { ...mockValidationService, isValidWhenProvided: () => false },
      );
      const app = new Hono();
      app.post("/", topicHandler.addTopic);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({ name: "Topic 1", categoryId: "invalid" }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 400 if topic name is invalid", async () => {
      // Arrange
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        { ...mockValidationService, isNonEmptyString: () => false },
      );
      const app = new Hono();
      app.post("/", topicHandler.addTopic);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({ name: "", categoryId: "1" }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
    });

    it("should return 404 if category does not exist", async () => {
      // Arrange
      const existsAsyncSpy = spy(() => Promise.resolve(false));
      mockCategoryService.existsAsync = existsAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", topicHandler.addTopic);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({ name: "Topic 1", categoryId: "1" }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 404);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 400 if topic already exists", async () => {
      // Arrange
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockCategoryService.existsAsync = existsAsyncSpy;
      const getAllAsyncSpy = spy(() =>
        Promise.resolve([{ id: 1, name: "Topic 1", categoryId: 1 }])
      );
      mockTopicService.getAllAsync = getAllAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.post("/", topicHandler.addTopic);
      const req = new Request("http://localhost/", {
        method: "POST",
        body: JSON.stringify({ name: "Topic 1", categoryId: "1" }),
      });

      // Act
      const res = await app.request(req);

      // Assert
      assertEquals(res.status, 400);
      assertEquals(existsAsyncSpy.calls.length, 1);
      assertEquals(getAllAsyncSpy.calls.length, 1);
    });
  });

  describe("deleteTopic", () => {
    it("should delete a topic", async () => {
      // Arrange
      const deleteAsyncSpy = spy(() => Promise.resolve());
      mockTopicService.deleteAsync = deleteAsyncSpy;
      const existsAsyncSpy = spy(() => Promise.resolve(true));
      mockTopicService.existsAsync = existsAsyncSpy;
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService,
      );
      const app = new Hono();
      app.delete("/:id", topicHandler.deleteTopic);
      const req = new Request("http://localhost/1", {
        method: "DELETE",
      });

      // Act
      const res = await app.request(req);
      const result = await res.json();

      // Assert
      assertEquals(result, { message: "Topic deleted successfully." });
      assertEquals(deleteAsyncSpy.calls.length, 1);
      assertEquals(existsAsyncSpy.calls.length, 1);
    });

    it("should return 400 if topicId is invalid", async () => {
      // Arrange
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        { ...mockValidationService, isValidPositiveInteger: () => false }
      );
      const app = new Hono();
      app.delete("/:id", topicHandler.deleteTopic);
      const req = new Request("http://localhost/invalid", {
        method: "DELETE",
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
      const topicHandler = new TopicHandler(
        mockTopicService,
        mockCategoryService,
        mockValidationService
      );
      const app = new Hono();
      app.delete("/:id", topicHandler.deleteTopic);
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