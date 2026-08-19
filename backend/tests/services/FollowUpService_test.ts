import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { FollowUpService } from "../../src/services/FollowUpService.ts";
import { MockPrisma } from "../mocks/prisma.ts";

describe("FollowUpService", () => {
  describe("getAllAsync", () => {
    it("should return follow-ups for a question", async () => {
      const followUps = [
        {
          id: 1,
          questionId: 2,
          levelId: 1,
          description: "Follow-up description",
          questionString: "What next?",
          question: {
            id: 2,
            description: "Question",
            topicId: 1,
            levelId: 1,
          },
        },
      ];
      const prisma = MockPrisma.create({
        followUps: {
          findMany: () => Promise.resolve(followUps),
        },
      });
      const followUpService = new FollowUpService(prisma);

      const result = await followUpService.getAllAsync({ questionId: 2 });

      assertEquals(result, followUps);
    });
  });

  describe("createAsync", () => {
    it("should create a new follow-up", async () => {
      const followUp = {
        id: 1,
        questionId: 2,
        levelId: 1,
        description: "Follow-up description",
        questionString: "What next?",
        question: {
          id: 2,
          description: "Question",
          topicId: 1,
          levelId: 1,
        },
      };
      const prisma = MockPrisma.create({
        followUps: {
          create: () => Promise.resolve(followUp),
        },
      });
      const followUpService = new FollowUpService(prisma);

      const result = await followUpService.createAsync({
        questionId: 2,
        levelId: 1,
        description: "Follow-up description",
        questionString: "What next?",
      });

      assertEquals(result, followUp);
    });
  });

  describe("updateAsync", () => {
    it("should update an existing follow-up", async () => {
      const followUp = {
        id: 1,
        questionId: 2,
        levelId: 2,
        description: "Updated description",
        questionString: "Updated question",
        question: {
          id: 2,
          description: "Question",
          topicId: 1,
          levelId: 1,
        },
      };
      const prisma = MockPrisma.create({
        followUps: {
          update: () => Promise.resolve(followUp),
        },
      });
      const followUpService = new FollowUpService(prisma);

      const result = await followUpService.updateAsync(1, {
        questionId: 2,
        levelId: 2,
        description: "Updated description",
        questionString: "Updated question",
      });

      assertEquals(result, followUp);
    });
  });

  describe("deleteAsync", () => {
    it("should delete a follow-up", async () => {
      const prisma = MockPrisma.create({
        followUps: {
          delete: () => Promise.resolve(),
        },
      });
      const followUpService = new FollowUpService(prisma);

      await followUpService.deleteAsync(1);
    });
  });
});
