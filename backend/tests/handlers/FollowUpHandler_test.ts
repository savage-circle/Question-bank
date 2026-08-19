import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { Hono } from "@hono/hono";
import { FollowUpHandler } from "../../src/handlers/FollowUpHandler.ts";
import { IService } from "../../src/services/IService.ts";
import { createMockValidationService } from "../mocks/validationService.ts";
import { CreateFollowUpDTO, FollowUp } from "../../src/types/followUp.ts";

describe("FollowUpHandler", () => {
  const mockFollowUpService: IService<FollowUp, CreateFollowUpDTO> = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(false),
    createAsync: () =>
      Promise.resolve({
        id: 1,
        questionId: 1,
        levelId: 1,
        description: "Follow up",
        questionString: "Next?",
        question: {
          id: 1,
          description: "Question",
          topicId: 1,
          levelId: 1,
        },
      }),
    updateAsync: () =>
      Promise.resolve({
        id: 1,
        questionId: 1,
        levelId: 1,
        description: "Follow up",
        questionString: "Next?",
        question: {
          id: 1,
          description: "Question",
          topicId: 1,
          levelId: 1,
        },
      }),
    deleteAsync: () => Promise.resolve(),
  };

  const mockQuestionService: IService<
    { id: number },
    {
      description: string;
      topicId: number;
      levelId: number;
    }
  > = {
    getAllAsync: () => Promise.resolve([]),
    getByIdAsync: () => Promise.resolve(null),
    existsAsync: () => Promise.resolve(true),
    createAsync: () => Promise.resolve({ id: 1 }),
    updateAsync: () => Promise.resolve({ id: 1 }),
    deleteAsync: () => Promise.resolve(),
  };

  const mockValidationService = createMockValidationService();

  it("should create a follow-up", async () => {
    const followUpHandler = new FollowUpHandler(
      mockFollowUpService,
      mockQuestionService as unknown as IService<{ id: number }, unknown>,
      mockValidationService,
    );
    const app = new Hono();
    app.post("/", followUpHandler.addFollowUp);
    const req = new Request("http://localhost/", {
      method: "POST",
      body: JSON.stringify({
        questionId: 1,
        levelId: 1,
        description: "Follow up",
        questionString: "Next?",
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 201);
  });

  it("should return 404 when question does not exist", async () => {
    const followUpHandler = new FollowUpHandler(
      mockFollowUpService,
      {
        ...mockQuestionService,
        existsAsync: () => Promise.resolve(false),
      } as unknown as IService<{ id: number }, unknown>,
      mockValidationService,
    );
    const app = new Hono();
    app.post("/", followUpHandler.addFollowUp);
    const req = new Request("http://localhost/", {
      method: "POST",
      body: JSON.stringify({
        questionId: 1,
        levelId: 1,
        description: "Follow up",
        questionString: "Next?",
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 404);
  });
});
