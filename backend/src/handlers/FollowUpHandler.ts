import { Context, TypedResponse } from "@hono/hono";
import { CreateFollowUpDTO, FollowUp } from "../types/followUp.ts";
import { IService } from "../services/IService.ts";
import { IValidationService } from "../services/IValidationService.ts";

export class FollowUpHandler {
  private followUpService: IService<FollowUp, CreateFollowUpDTO>;
  private questionService: IService<{ id: number }, unknown>;
  private validationService: IValidationService;

  constructor(
    followUpService: IService<FollowUp, CreateFollowUpDTO>,
    questionService: IService<{ id: number }, unknown>,
    validationService: IValidationService,
  ) {
    this.followUpService = followUpService;
    this.questionService = questionService;
    this.validationService = validationService;

    this.getFollowUps = this.getFollowUps.bind(this);
    this.addFollowUp = this.addFollowUp.bind(this);
    this.updateFollowUp = this.updateFollowUp.bind(this);
    this.deleteFollowUp = this.deleteFollowUp.bind(this);
  }

  async getFollowUps(
    c: Context,
  ): Promise<TypedResponse<FollowUp[]> | TypedResponse<{ error: string }>> {
    const questionId = c.req.query("questionId");

    if (!this.validationService.isValidWhenProvided(questionId)) {
      return c.json({ error: "Invalid questionId" }, 400);
    }

    try {
      const followUps = await this.followUpService.getAllAsync({
        questionId: questionId ? Number(questionId) : undefined,
      });

      return c.json(followUps);
    } catch {
      return c.json({ error: "Failed to fetch follow-ups" }, 500);
    }
  }

  async addFollowUp(
    c: Context,
  ): Promise<TypedResponse<FollowUp> | TypedResponse<{ error: string }>> {
    const data: CreateFollowUpDTO = await c.req.json();
    const validation = this.validationService.validateFollowUpUpsertInput(data);

    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.questionService.existsAsync(data.questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      const created = await this.followUpService.createAsync(data);
      return c.json(created, 201);
    } catch {
      return c.json({ error: "Failed to add follow-up" }, 500);
    }
  }

  async updateFollowUp(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const data: CreateFollowUpDTO = await c.req.json();
    const id = c.req.param("id");
    const followUpId = Number(id);

    if (!this.validationService.isValidPositiveInteger(followUpId)) {
      return c.json({ error: "Invalid follow-up id." }, 400);
    }

    const validation = this.validationService.validateFollowUpUpsertInput(data);
    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.followUpService.existsAsync(followUpId))) {
        return c.json({ error: "Follow-up does not exist." }, 404);
      }

      if (!(await this.questionService.existsAsync(data.questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      await this.followUpService.updateAsync(followUpId, data);
      return c.json({ message: "Follow-up updated successfully." });
    } catch {
      return c.json({ error: "Failed to update follow-up" }, 500);
    }
  }

  async deleteFollowUp(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const id = c.req.param("id");
    const followUpId = Number(id);

    if (!this.validationService.isValidPositiveInteger(followUpId)) {
      return c.json({ error: "Invalid follow-up id." }, 400);
    }

    try {
      if (!(await this.followUpService.existsAsync(followUpId))) {
        return c.json({ error: "Follow-up does not exist." }, 404);
      }

      await this.followUpService.deleteAsync(followUpId);
      return c.json({ message: "Follow-up deleted successfully." });
    } catch {
      return c.json({ error: "Failed to delete follow-up" }, 500);
    }
  }
}
