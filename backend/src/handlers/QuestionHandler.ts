import { Context, TypedResponse } from "@hono/hono";
import { Question, QuestionResponse, CreateQuestionDTO } from "../types/question.ts";
import { CreateFollowUpDTO, FollowUpSummary } from "../types/followUp.ts";
import LevelType from "../enums/levelType.ts";
import { IService } from "../services/IService.ts";
import { IQuestionService } from "../services/IQuestionService.ts";
import { CreateTopicDTO, Topic } from "../types/topic.ts";
import { IValidationService } from "../services/IValidationService.ts";

export class QuestionHandler {
  private questionService: IQuestionService;
  private topicService: IService<Topic, CreateTopicDTO>;
  private validationService: IValidationService;

  constructor(questionService: IQuestionService, topicService: IService<Topic, CreateTopicDTO>, validationService: IValidationService) {
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

      const inputValidation = this.validationService.validateGetQuestionInput(categoryId, topicId, levelId);
      if (!inputValidation.isValid) {
        return c.json({ error: inputValidation.error! }, 400);
      }

      const questions = await this.questionService.getAllAsync({
        categoryId: categoryId ? Number(categoryId) : undefined,
        topicId: topicId ? Number(topicId) : undefined,
        levelId: levelId ? Number(levelId) : undefined,
      });

      const response: QuestionResponse[] = questions.map((question: Question) => ({
        id: question.id,
        description: question.description,
        topicName: question.topic.name,
        levelName: this.getLevelName(question.levelId),
        followUps: question.followUps,
      }));

      return c.json(response);
    } catch (_error) {
      return c.json({ error: "Failed to fetch questions" }, 500);
    }
  }

  async addQuestion(
    c: Context,
  ): Promise<
    TypedResponse<Question> | TypedResponse<{ error: string }>
  > {
    const data: CreateQuestionDTO = await c.req.json();
    const validation = this.validationService.validateQuestionUpsertInput(data);

    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.topicService.existsAsync(data.topicId))) {
        return c.json({ error: "Topic does not exist." }, 404);
      }

      const newQuestion = await this.questionService.createAsync(data);
      return c.json(newQuestion, 201);
    } catch {
      return c.json({ error: "Failed to add question" }, 500);
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
      if (!questionId || !(await this.questionService.existsAsync(questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      if (!(await this.topicService.existsAsync(data.topicId))) {
        return c.json({ error: "Topic does not exist." }, 404);
      }

      await this.questionService.updateAsync(questionId,data);

      return c.json({ message: "Question updated successfully." });
    } catch {
      return c.json({ error: "Failed to update question" }, 500);
    }
  }

  async getQuestionFollowUps(
    c: Context,
  ): Promise<TypedResponse<FollowUpSummary[]> | TypedResponse<{ error: string }>> {
    const questionId = Number(c.req.param("id"));

    if (!this.validationService.isValidPositiveInteger(questionId)) {
      return c.json({ error: "Invalid question id." }, 400);
    }

    try {
      if (!(await this.questionService.existsAsync(questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      const followUps = await this.questionService.getFollowUpsAsync(questionId);
      return c.json(followUps);
    } catch {
      return c.json({ error: "Failed to fetch follow-ups" }, 500);
    }
  }

  async addQuestionFollowUp(
    c: Context,
  ): Promise<TypedResponse<FollowUpSummary> | TypedResponse<{ error: string }>> {
    const questionId = Number(c.req.param("id"));
    const data: CreateFollowUpDTO = await c.req.json();

    if (!this.validationService.isValidPositiveInteger(questionId)) {
      return c.json({ error: "Invalid question id." }, 400);
    }

    const validation = this.validationService.validateFollowUpUpsertInput(data);
    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.questionService.existsAsync(questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      const created = await this.questionService.addFollowUpAsync(questionId, data);
      return c.json(created, 201);
    } catch {
      return c.json({ error: "Failed to add follow-up" }, 500);
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
      return c.json({ error: "Invalid question id." }, 400);
    }

    if (!this.validationService.isValidPositiveInteger(followUpId)) {
      return c.json({ error: "Invalid follow-up id." }, 400);
    }

    const validation = this.validationService.validateFollowUpUpsertInput(data);
    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!(await this.questionService.followUpExistsAsync(followUpId, questionId))) {
        return c.json({ error: "Follow-up does not exist." }, 404);
      }

      await this.questionService.updateFollowUpAsync(followUpId, data);
      return c.json({ message: "Follow-up updated successfully." });
    } catch {
      return c.json({ error: "Failed to update follow-up" }, 500);
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
      return c.json({ error: "Invalid question id." }, 400);
    }

    if (!this.validationService.isValidPositiveInteger(followUpId)) {
      return c.json({ error: "Invalid follow-up id." }, 400);
    }

    try {
      if (!(await this.questionService.followUpExistsAsync(followUpId, questionId))) {
        return c.json({ error: "Follow-up does not exist." }, 404);
      }

      await this.questionService.deleteFollowUpAsync(followUpId);
      return c.json({ message: "Follow-up deleted successfully." });
    } catch {
      return c.json({ error: "Failed to delete follow-up" }, 500);
    }
  }

  getLevelName(levelId: number): string {
    return LevelType[levelId] ?? "UNKNOWN";
  }
}
