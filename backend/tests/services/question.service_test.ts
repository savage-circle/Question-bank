import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing";
import { QuestionService } from "../../src/services/question.service.ts";
import { PrismaClient } from "../../src/generated/prisma/client.ts";

const sampleQuestion = {
  id: 101,
  description: "Explain the concept of polymorphism.",
  topicId: 4,
  levelId: 2,
  extensions: null,
  topic: { id: 4, name: "OOPs", categoryId: 1 },
};

describe("QuestionService", () => {
  describe("getQuestions", () => {
    it("should return all questions with no filters", async () => {
      const questions = [sampleQuestion];

      const findManySpy = (args: unknown) => {
        assertEquals(args, {
          where: {},
          include: { topic: true },
        });

        return Promise.resolve(questions);
      };

      const prisma = {
        question: { findMany: findManySpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      const result = await service.getQuestions();

      assertEquals(result, questions);
    });

    it("should filter by topicId only", async () => {
      const findManySpy = (args: unknown) => {
        assertEquals(args, {
          where: { topicId: 4 },
          include: { topic: true },
        });

        return Promise.resolve([sampleQuestion]);
      };

      const prisma = {
        question: { findMany: findManySpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      await service.getQuestions({ topicId: 4 });
    });

    it("should filter by levelId only", async () => {
      const findManySpy = (args: unknown) => {
        assertEquals(args, {
          where: { levelId: 2 },
          include: { topic: true },
        });

        return Promise.resolve([sampleQuestion]);
      };

      const prisma = {
        question: { findMany: findManySpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      await service.getQuestions({ levelId: 2 });
    });

    it("should filter by categoryId via the related topic", async () => {
      const findManySpy = (args: unknown) => {
        assertEquals(args, {
          where: { topic: { categoryId: 1 } },
          include: { topic: true },
        });

        return Promise.resolve([sampleQuestion]);
      };

      const prisma = {
        question: { findMany: findManySpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      await service.getQuestions({ categoryId: 1 });
    });

    it("should combine category, topic and level filters", async () => {
      const findManySpy = (args: unknown) => {
        assertEquals(args, {
          where: {
            topicId: 4,
            levelId: 2,
            topic: { categoryId: 1 },
          },
          include: { topic: true },
        });

        return Promise.resolve([sampleQuestion]);
      };

      const prisma = {
        question: { findMany: findManySpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      await service.getQuestions({ categoryId: 1, topicId: 4, levelId: 2 });
    });
  });
  describe("deleteQuestion", () => {
    it("should delete a question by id", async () => {
      const deletedQuestion = {
        id: 101,
        description: "Explain the concept of polymorphism.",
        topicId: 4,
        levelId: 2,
        extensions: null,
      };

      const deleteSpy = (args: unknown) => {
        assertEquals(args, {
          where: { id: 101 },
        });

        return Promise.resolve(deletedQuestion);
      };

      const prisma = {
        question: {
          delete: deleteSpy,
        },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      const result = await service.deleteQuestion(101);

      assertEquals(result, deletedQuestion);
    });

    it("should give error when question does not exist", async () => {
      const deleteSpy = () => {
        return Promise.reject(new Error("Question not found"));
      };

      const prisma = {
        question: {
          delete: deleteSpy,
        },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      let error;

      try {
        await service.deleteQuestion(999);
      } catch (e) {
        error = e;
      }

      assertEquals((error as Error).message, "Question not found");
    });
  });
});
