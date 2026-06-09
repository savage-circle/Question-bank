import { Context, TypedResponse } from "@hono/hono";
import { QuestionService } from "../services/question.service.ts";
import { QuestionResponse } from "../types/question.ts";
import LevelType from "../enums/levelType.ts";

export class QuestionHandler {
  private questionService: QuestionService;
  constructor(questionService: QuestionService) {
    this.questionService = questionService;

    // bind methods
    this.getQuestions = this.getQuestions.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
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

  isValidId(value: string | undefined): boolean {
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

  async deleteQuestion(c: Context): Promise<Response> {
    const questionId = Number(c.req.query("id"));
    if (isNaN(questionId)) {
      return c.json({ error: "Invalid question ID" }, 400);
    }

    try {
      await this.questionService.deleteQuestion(questionId);
      return c.body(null, 204);
    } catch {
      return c.json({ error: "Question does not exist" }, 404);
    }
  }
}
