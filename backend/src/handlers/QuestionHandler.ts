import { Context, TypedResponse } from "@hono/hono";
import { QuestionService } from "../services/question.service.ts";
import { QuestionResponse, UpdateQuestionRequest } from "../types/question.ts";
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

  async updateQuestionValidator(c:Context, questionId : number, { description, topicId, levelId, extensions }: UpdateQuestionRequest){
      if (!this.isValidId(questionId)) {
        return c.json({ error: "Invalid question ID." }, 400);
      }
  
      const isQuestionExists: boolean =
        await this.questionService.isQuestionExists(questionId);
  
      if (!isQuestionExists) {
        return c.json({ error: "Question does not exist." }, 404);
      }
  
      if (!description || description.trim() === "") {
        return c.json({ error: "Question description is required." }, 400);
      }
  
      if (!topicId || !this.isValidId(topicId)) {
        return c.json({ error: "Invalid topic id or TopicId is required" }, 400);
      }

      if (topicId && !(await this.topicService.isTopicExists(Number(topicId)))) {
        return c.json({ error: "Topic does not exist." }, 404);
      }
      
      if (!LevelType[Number(levelId)]) {
        return c.json({ error: "LevelId should be valid enum value" }, 400);
      }
  
      if (extensions !== undefined) {
        if (!Array.isArray(extensions)) {
          return c.json({ error: "Extensions must be an array." }, 400);
        }
        for (const ext of extensions) {
          if (typeof ext !== "string" || ext.trim() === "") {
            return c.json(
              { error: "Extension values must be non-empty strings." },
              400,
            );
          }
        }
      }
      return null;
    }

  async updateQuestion(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const data = await c.req.json();
    const id = c.req.param("id");
    const questionId = Number(id);
    
  const validationError = await this.updateQuestionValidator(c,questionId, data);
  if (validationError) return validationError;

    try {
      const newQuestionAttributes = {
        description: data.description,
        topicId: data.topicId,
        levelId: data.levelId,
        ...(data.extensions && { extensions: data.extensions }),
      };
      
     await this.questionService.updateQuestion(questionId, newQuestionAttributes);

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
