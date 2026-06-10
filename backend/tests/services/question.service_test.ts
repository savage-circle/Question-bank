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

  describe("updateQuestion", () => {
    it("should update the question", async () => {
      let updatedData: unknown = null;

      const updateSpy = (args: unknown) => {
        updatedData = args;
        return Promise.resolve();
      };

      const prisma = {
        question: { update: updateSpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      const newQuestionAttributes = {
        description: "Updated description",
        topicId: 5,
        levelId: 3,
        extensions: ["Think about inheritance."],
      };

      await service.updateQuestion(101, newQuestionAttributes);

      assertEquals(updatedData, {
        where: { id: 101 },
        data: {
          ...newQuestionAttributes,
          extensions: JSON.stringify(newQuestionAttributes.extensions),
        },
      });
    });

     it("should update the question without extensions", async () => {
      let updatedData: unknown = null;

      const updateSpy = (args: unknown) => {
        updatedData = args;
        return Promise.resolve();
      };

      const prisma = {
        question: { update: updateSpy },
      } as unknown as PrismaClient;

      const service = new QuestionService(prisma);

      const newQuestionAttributes = {
        description: "Updated description",
        topicId: 5,
        levelId: 3,
      };

      await service.updateQuestion(101, newQuestionAttributes);

      assertEquals(updatedData, {
        where: { id: 101 },
        data: {
          ...newQuestionAttributes,
        },
      });
    });
  });
});
