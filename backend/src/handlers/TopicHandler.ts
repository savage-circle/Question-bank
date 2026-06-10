import { Context, TypedResponse } from "@hono/hono";
import { TopicService } from "../services/topic.service.ts";
import { CategoryService } from "../services/category.service.ts";
import { Topic } from "../types/topic.ts";
import { isValidId } from "../lib/validation.ts";
import { capitalize } from "../lib/string.ts";

export class TopicHandler {
  private readonly topicService: TopicService;
  private readonly categoryService: CategoryService;
  constructor(topicService: TopicService, categoryService: CategoryService) {
    this.topicService = topicService;
    this.categoryService = categoryService;

    // bind methods
    this.getTopics = this.getTopics.bind(this);
    this.addTopic = this.addTopic.bind(this);
  }

  async getTopics(
    c: Context,
  ): Promise<TypedResponse<Topic[]> | TypedResponse<{ error: string }>> {
    try {
      const categoryId = c.req.query("categoryId");

      if (!isValidId(categoryId)) {
        return c.json({ error: "Invalid categoryId" }, 400);
      }

      if (
        categoryId !== undefined &&
        !(await this.categoryService.categoryExists(Number(categoryId)))
      ) {
        return c.json(
          { error: `Category not found with Id : ${categoryId}` },
          404,
        );
      }

      const topics = await this.topicService.getTopics(
        categoryId ? Number(categoryId) : undefined,
      );

      return c.json(topics);
    } catch (_error) {
      return c.json({ error: "Failed to fetch topics" }, 500);
    }
  }

  async addTopic(
    c: Context,
  ): Promise<TypedResponse<Topic> | TypedResponse<{ error: string }>> {
    let body: { name?: unknown; categoryId?: unknown };
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { name, categoryId } = body;

    if (!isValidId(categoryId as string | number | undefined)) {
      return c.json({ error: "Invalid categoryId" }, 400);
    }

    if (!name || typeof name !== "string") {
      return c.json({ error: "Invalid topic name" }, 400);
    }

    try {
      if (!(await this.categoryService.categoryExists(Number(categoryId)))) {
        return c.json(
          { error: `Category not found with Id : ${categoryId}` },
          404,
        );
      }

      const normalizedName = capitalize(name.trim());

      const existingTopics = await this.topicService.getTopics(
        Number(categoryId),
      );
      const topicExists = existingTopics.some(
        (topic) => topic.name === normalizedName,
      );

      if (topicExists) {
        return c.json({ error: "Topic already exists" }, 400);
      }

      const newTopic = await this.topicService.addTopic(
        normalizedName,
        Number(categoryId),
      );
      return c.json(newTopic, 201);
    } catch (_error) {
      return c.json({ error: "Failed to add topic" }, 500);
    }
  }
}
