import { Context, TypedResponse } from "@hono/hono";
import { QuestionService } from "../services/question.service.ts";
import { QuestionResponse, QuestionRequest } from "../types/question.ts";
import LevelType from "../enums/levelType.ts";
import { TopicService } from "../services/topic.service.ts";

export class QuestionHandler {
  private questionService: QuestionService;
  private topicService!: TopicService;
  constructor(questionService: QuestionService, topicService: TopicService) {
    this.questionService = questionService;
    this.topicService = topicService;

    // bind methods
    this.getQuestions = this.getQuestions.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
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

      if (!this.isValidId(categoryId)) {
        return c.json({ error: "Invalid categoryId" }, 400);
      }

      if (!this.isValidId(topicId)) {
        return c.json({ error: "Invalid topicId" }, 400);
      }

      if (!this.isValidId(levelId)) {
        return c.json({ error: "Invalid levelId" }, 400);
      }

      const questions = await this.questionService.getQuestions({
        categoryId: categoryId ? Number(categoryId) : undefined,
        topicId: topicId ? Number(topicId) : undefined,
        levelId: levelId ? Number(levelId) : undefined,
      });

      const response: QuestionResponse[] = questions.map((question) => ({
        id: question.id,
        description: question.description,
        topicName: question.topic.name,
        levelName: this.getLevelName(question.levelId),
        extensions: this.parseExtensions(question.extensions),
      }));

      return c.json(response);
    } catch (_error) {
      return c.json({ error: "Failed to fetch questions" }, 500);
    }
  }

  private questionRequestValidator(data: QuestionRequest): { isValid: boolean; error?: string } {
    const { description, topicId, levelId, extensions } = data;
    
    if (!description || description.trim() === "") {
      return { isValid: false,error: "Question description is required." };
    }

    const num = Number(topicId);

    if (!Number.isInteger(num) || num < 1) {
      return { isValid: false, error: "Invalid topic id." };
    }

    if (!LevelType[Number(levelId)]) {
      return { isValid: false, error: "LevelId should be valid enum value" };
    }

    if (extensions && (!Array.isArray(extensions) || extensions!.some((ext) => typeof ext !== "string"))) {
      return { isValid: false, error: "Extensions should be an array of non-empty strings." };
    }

    return { isValid: true };
  }



  async updateQuestion(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const data: QuestionRequest = await c.req.json();
    const id = c.req.param("id");
    const questionId = Number(id);
    const validation = this.questionRequestValidator(data);

    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    try {
      if (!questionId || !(await this.questionService.isQuestionExists(questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      if (!(await this.topicService.isTopicExists(data.topicId))) {
        return c.json({ error: "Topic does not exist." }, 404);
      }

      await this.questionService.updateQuestion(questionId,data);

      return c.json({ message: "Question updated successfully." });
    } catch {
      return c.json({ error: "Failed to update question" }, 500);
    }
  }

  isValidId(value: number | string | undefined): boolean {
    if (value === undefined) {
      return true;
    }

    return Number(value) > 0;
  }

  getLevelName(levelId: number): string {
    return LevelType[levelId] ?? "UNKNOWN";
  }

  parseExtensions(extensions: string | null): string[] {
    if (!extensions) {
      return [];
    }

    try {
      const parsed = JSON.parse(extensions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
