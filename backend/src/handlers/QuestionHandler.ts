import { Context, TypedResponse } from "@hono/hono";
import {
  Question,
  QuestionResponse,
  CreateQuestionDTO,
} from "../types/question.ts";
import { CreateFollowUpDTO, FollowUpSummary } from "../types/followUp.ts";
import LevelType from "../enums/levelType.ts";
import { IService } from "../services/IService.ts";
import { IQuestionService } from "../services/IQuestionService.ts";
import { CreateTopicDTO, Topic } from "../types/topic.ts";
import { IValidationService } from "../services/IValidationService.ts";
import { isPrismaError } from "../utils/prismaErrors.ts";
import { Messages } from "../constants.ts";

export class QuestionHandler {
  private questionService: IQuestionService;
  private topicService: IService<Topic, CreateTopicDTO>;
  private validationService: IValidationService;

  constructor(
    questionService: IQuestionService,
    topicService: IService<Topic, CreateTopicDTO>,
    validationService: IValidationService,
  ) {
    this.questionService = questionService;
    this.topicService = topicService;
    this.validationService = validationService;

    // bind methods
    this.getQuestions = this.getQuestions.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.getQuestionFollowUps = this.getQuestionFollowUps.bind(this);
    this.addQuestionFollowUp = this.addQuestionFollowUp.bind(this);
    this.updateQuestionFollowUp = this.updateQuestionFollowUp.bind(this);
    this.deleteQuestionFollowUp = this.deleteQuestionFollowUp.bind(this);
  }

  async getQuestions(
    c: Context,
  ): Promise<
    TypedResponse<QuestionResponse[]> | TypedResponse<{ error: string }>
  > {
    try {
      const categoryId = c.req.query("categoryId");
      const topicId = c.req.query("topicId");
      const levelId = c.req.query("levelId");

      const inputValidation = this.validationService.validateGetQuestionInput(
        categoryId,
        topicId,
        levelId,
      );
      if (!inputValidation.isValid) {
        return c.json({ error: inputValidation.error! }, 400);
      }

      const questions = await this.questionService.getAllAsync({
        categoryId: categoryId ? Number(categoryId) : undefined,
        topicId: topicId ? Number(topicId) : undefined,
        levelId: levelId ? Number(levelId) : undefined,
      });

      const response: QuestionResponse[] = questions.map(
        (question: Question) => ({
          id: question.id,
          description: question.description,
          topicName: question.topic.name,
          levelName: this.getLevelName(question.levelId),
          followUps: question.followUps,
        }),
      );

      return c.json(response);
    } catch (_error) {
      return c.json({ error: Messages.FetchQuestionsFailed }, 500);
    }
  }

  async addQuestion(
    c: Context,
  ): Promise<TypedResponse<Question> | TypedResponse<{ error: string }>> {
    const data: CreateQuestionDTO = await c.req.json();
    const validation = this.validationService.validateQuestionUpsertInput(data);

    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.topicService.existsAsync(data.topicId))) {
        return c.json({ error: Messages.TopicNotFound }, 404);
      }

      const newQuestion = await this.questionService.createAsync(data);
      return c.json(newQuestion, 201);
    } catch {
      return c.json({ error: Messages.AddQuestionFailed }, 500);
    }
  }

  async updateQuestion(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const data: CreateQuestionDTO = await c.req.json();
    const id = c.req.param("id");
    const questionId = Number(id);
    const validation = this.validationService.validateQuestionUpsertInput(data);

    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (
        !questionId ||
        !(await this.questionService.existsAsync(questionId))
      ) {
        return c.json({ error: Messages.QuestionNotFound }, 404);
      }

      if (!(await this.topicService.existsAsync(data.topicId))) {
        return c.json({ error: Messages.TopicNotFound }, 404);
      }

      await this.questionService.updateAsync(questionId, data);

      return c.json({ message: Messages.QuestionUpdated });
    } catch {
      return c.json({ error: Messages.UpdateQuestionFailed }, 500);
    }
  }

  async getQuestionFollowUps(
    c: Context,
  ): Promise<
    TypedResponse<FollowUpSummary[]> | TypedResponse<{ error: string }>
  > {
    const questionId = Number(c.req.param("id"));

    if (!this.validationService.isValidPositiveInteger(questionId)) {
      return c.json({ error: Messages.InvalidQuestionId }, 400);
    }

    try {
      if (!(await this.questionService.existsAsync(questionId))) {
        return c.json({ error: Messages.QuestionNotFound }, 404);
      }

      const followUps =
        await this.questionService.getFollowUpsAsync(questionId);
      return c.json(followUps);
    } catch {
      return c.json({ error: Messages.FetchFollowUpsFailed }, 500);
    }
  }

  async addQuestionFollowUp(
    c: Context,
  ): Promise<
    TypedResponse<FollowUpSummary> | TypedResponse<{ error: string }>
  > {
    const questionId = Number(c.req.param("id"));
    const data: CreateFollowUpDTO = await c.req.json();

    if (!this.validationService.isValidPositiveInteger(questionId)) {
      return c.json({ error: Messages.InvalidQuestionId }, 400);
    }

    const validation = this.validationService.validateFollowUpUpsertInput(data);
    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.questionService.existsAsync(questionId))) {
        return c.json({ error: Messages.QuestionNotFound }, 404);
      }

      const created = await this.questionService.addFollowUpAsync(
        questionId,
        data,
      );
      return c.json(created, 201);
    } catch {
      return c.json({ error: Messages.AddFollowUpFailed }, 500);
    }
  }

  async updateQuestionFollowUp(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const questionId = Number(c.req.param("id"));
    const followUpId = Number(c.req.param("followUpId"));
    const data: CreateFollowUpDTO = await c.req.json();

    if (!this.validationService.isValidPositiveInteger(questionId)) {
      return c.json({ error: Messages.InvalidQuestionId }, 400);
    }

    if (!this.validationService.isValidPositiveInteger(followUpId)) {
      return c.json({ error: Messages.InvalidFollowUpId }, 400);
    }

    const validation = this.validationService.validateFollowUpUpsertInput(data);
    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      await this.questionService.updateFollowUpAsync(followUpId, data);
      return c.json({ message: Messages.FollowUpUpdated });
    } catch (error) {
      if (isPrismaError(error, "P2025")) {
        return c.json({ error: Messages.FollowUpNotFound }, 404);
      }
      return c.json({ error: Messages.UpdateFollowUpFailed }, 500);
    }
  }

  async deleteQuestionFollowUp(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const questionId = Number(c.req.param("id"));
    const followUpId = Number(c.req.param("followUpId"));

    if (!this.validationService.isValidPositiveInteger(questionId)) {
      return c.json({ error: Messages.InvalidQuestionId }, 400);
    }

    if (!this.validationService.isValidPositiveInteger(followUpId)) {
      return c.json({ error: Messages.InvalidFollowUpId }, 400);
    }

    try {
      await this.questionService.deleteFollowUpAsync(followUpId);
      return c.json({ message: Messages.FollowUpDeleted });
    } catch (error) {
      if (isPrismaError(error, "P2025")) {
        return c.json({ error: Messages.FollowUpNotFound }, 404);
      }
      return c.json({ error: Messages.DeleteFollowUpFailed }, 500);
    }
  }

  getLevelName(levelId: number): string {
    return LevelType[levelId] ?? "UNKNOWN";
  }
}
