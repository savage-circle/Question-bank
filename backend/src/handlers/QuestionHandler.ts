import { Context, TypedResponse } from "@hono/hono";
import { QuestionService } from "../services/question.service.ts";
import { QuestionRequest, QuestionResponse } from "../types/question.ts";
import { TopicService } from "../services/topic.service.ts";
import { isValidId } from "../lib/validation.ts";
import {
  getLevelName,
  parseExtensions,
  validateQuestionRequest,
} from "../lib/questionHelpers.ts";

export class QuestionHandler {
  private readonly questionService: QuestionService;
  private readonly topicService: TopicService;
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

      if (!isValidId(categoryId)) {
        return c.json({ error: "Invalid categoryId" }, 400);
      }

      if (!isValidId(topicId)) {
        return c.json({ error: "Invalid topicId" }, 400);
      }

      if (!isValidId(levelId)) {
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
        levelName: getLevelName(question.levelId),
        extensions: parseExtensions(question.extensions),
      }));

      return c.json(response);
    } catch (_error) {
      return c.json({ error: "Failed to fetch questions" }, 500);
    }
  }

  async updateQuestion(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const id = c.req.param("id");

    if (!isValidId(id)) {
      return c.json({ error: "Invalid question id" }, 400);
    }

    let data: QuestionRequest;
    try {
      data = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const validation = validateQuestionRequest(data);

    if (!validation.isValid) {
      return c.json({ error: validation.error! }, 400);
    }

    const questionId = Number(id);

    try {
      if (!(await this.questionService.questionExists(questionId))) {
        return c.json({ error: "Question does not exist." }, 404);
      }

      if (!(await this.topicService.topicExists(data.topicId))) {
        return c.json({ error: "Topic does not exist." }, 404);
      }

      await this.questionService.updateQuestion(questionId, data);

      return c.json({ message: "Question updated successfully." });
    } catch {
      return c.json({ error: "Failed to update question" }, 500);
    }
  }
}
