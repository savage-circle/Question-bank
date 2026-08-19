import {
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { QuestionService } from "../../src/services/QuestionService.ts";
import { MockPrisma } from "../mocks/prisma.ts";

describe("QuestionService", () => {
  describe("getAllAsync", () => {
    it("should return all questions", async () => {
      // Arrange
      const questions = [
        {
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
        },
      ];
      const prisma = MockPrisma.create({
        question: {
          findMany: () => Promise.resolve(questions),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.getAllAsync();

      // Assert
      assertEquals(result, questions);
    });

    it("should return questions by topicId", async () => {
      // Arrange
      const questions = [
        {
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
        },
      ];
      const prisma = MockPrisma.create({
        question: {
          findMany: () => Promise.resolve(questions),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.getAllAsync({ topicId: 1 });

      // Assert
      assertEquals(result, questions);
    });

    it("should return questions by levelId", async () => {
      // Arrange
      const questions = [
        {
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
        },
      ];
      const prisma = MockPrisma.create({
        question: {
          findMany: () => Promise.resolve(questions),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.getAllAsync({ levelId: 1 });

      // Assert
      assertEquals(result, questions);
    });

    it("should return questions by categoryId", async () => {
      // Arrange
      const questions = [
        {
          id: 1,
          description: "Question 1",
          topicId: 1,
          levelId: 1,
          topic: { id: 1, name: "Topic 1", categoryId: 1 },
        },
      ];
      const prisma = MockPrisma.create({
        question: {
          findMany: () => Promise.resolve(questions),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.getAllAsync({ categoryId: 1 });

      // Assert
      assertEquals(result, questions);
    });
  });

  describe("getByIdAsync", () => {
    it("should return a question by id", async () => {
      // Arrange
      const question = {
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      };
      const prisma = MockPrisma.create({
        question: {
          findUnique: () => Promise.resolve(question),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.getByIdAsync(1);

      // Assert
      assertEquals(result, question);
    });
  });

  describe("existsAsync", () => {
    it("should return true if a question exists", async () => {
      // Arrange
      const question = {
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      };
      const prisma = MockPrisma.create({
        question: {
          findUnique: () => Promise.resolve(question),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.existsAsync(1);

      // Assert
      assertEquals(result, true);
    });

    it("should return false if a question does not exist", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        question: {
          findUnique: () => Promise.resolve(null),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.existsAsync(1);

      // Assert
      assertEquals(result, false);
    });
  });

  describe("createAsync", () => {
    it("should create a new question", async () => {
      // Arrange
      const question = {
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      };
      const prisma = MockPrisma.create({
        question: {
          create: () => Promise.resolve(question),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.createAsync({
        description: "Question 1",
        topicId: 1,
        levelId: 1,
      });

      // Assert
      assertEquals(result, question);
    });
  });

  describe("updateAsync", () => {
    it("should update a question", async () => {
      // Arrange
      const question = {
        id: 1,
        description: "Question 1",
        topicId: 1,
        levelId: 1,
        topic: { id: 1, name: "Topic 1", categoryId: 1 },
      };
      const prisma = MockPrisma.create({
        question: {
          update: () => Promise.resolve(question),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.updateAsync(1, {
        description: "Question 1",
        topicId: 1,
        levelId: 1,
      });

      // Assert
      assertEquals(result, question);
    });
  });

  describe("deleteAsync", () => {
    it("should delete a question", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        question: {
          delete: () => Promise.resolve(),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      await questionService.deleteAsync(1);

      // Assert
      // No assertion needed, just checking that it doesn't throw
    });
  });

  describe("getFollowUpsAsync", () => {
    it("should return follow-ups for a question", async () => {
      // Arrange
      const followUps = [
        {
          id: 1,
          levelId: 1,
          description: "Follow-up description",
          questionString: "What next?",
        },
      ];
      const prisma = MockPrisma.create({
        followUps: {
          findMany: () => Promise.resolve(followUps),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.getFollowUpsAsync(2);

      // Assert
      assertEquals(result, followUps);
    });
  });

  describe("followUpExistsAsync", () => {
    it("should return true if the follow-up exists for the question", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        followUps: {
          findFirst: () => Promise.resolve({ id: 1 }),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.followUpExistsAsync(1, 2);

      // Assert
      assertEquals(result, true);
    });

    it("should return false if the follow-up does not exist for the question", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        followUps: {
          findFirst: () => Promise.resolve(null),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.followUpExistsAsync(1, 2);

      // Assert
      assertEquals(result, false);
    });
  });

  describe("addFollowUpAsync", () => {
    it("should create a new follow-up for a question", async () => {
      // Arrange
      const followUp = {
        id: 1,
        levelId: 1,
        description: "Follow-up description",
        questionString: "What next?",
      };
      const prisma = MockPrisma.create({
        followUps: {
          create: () => Promise.resolve(followUp),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.addFollowUpAsync(2, {
        levelId: 1,
        description: "Follow-up description",
        questionString: "What next?",
      });

      // Assert
      assertEquals(result, followUp);
    });
  });

  describe("updateFollowUpAsync", () => {
    it("should update an existing follow-up", async () => {
      // Arrange
      const followUp = {
        id: 1,
        levelId: 2,
        description: "Updated description",
        questionString: "Updated question",
      };
      const prisma = MockPrisma.create({
        followUps: {
          update: () => Promise.resolve(followUp),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      const result = await questionService.updateFollowUpAsync(1, {
        levelId: 2,
        description: "Updated description",
        questionString: "Updated question",
      });

      // Assert
      assertEquals(result, followUp);
    });
  });

  describe("deleteFollowUpAsync", () => {
    it("should delete a follow-up", async () => {
      // Arrange
      const prisma = MockPrisma.create({
        followUps: {
          delete: () => Promise.resolve(),
        },
      });
      const questionService = new QuestionService(prisma);

      // Act
      await questionService.deleteFollowUpAsync(1);

      // Assert
      // No assertion needed, just checking that it doesn't throw
    });
  });
});