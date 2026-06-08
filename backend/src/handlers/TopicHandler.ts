import { Context, TypedResponse } from "@hono/hono";
import { TopicService } from "../services/topic.service.ts";
import { CategoryService } from "../services/category.service.ts";
import { Topic } from "../types/topic.ts";
import _ from "lodash";

export class TopicHandler {
  private topicService: TopicService;
  private categoryService: CategoryService;
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

      const isValidCategoryId: boolean = this.isValidCategoryId(categoryId);

      if (!isValidCategoryId) {
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
    } catch (e: any) {
      return c.json({ error: "Failed to fetch topics" }, 500);
    }
  }

  async addTopic(
    c: Context,
  ): Promise<TypedResponse<Topic> | TypedResponse<{ error: string }>> {
    const { name, categoryId } = await c.req.json();

    const isValidCategoryId: boolean = this.isValidCategoryId(categoryId);

    if (!isValidCategoryId) {
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

      const existingTopics = await this.topicService.getTopics(
        Number(categoryId),
      );
      const topicExists = existingTopics.some(
        (topic) => topic.name === _.capitalize(name.trim()),
      );

      if (topicExists) {
        return c.json({ error: "Topic already exists" }, 400);
      }

      const newTopic = await this.topicService.addTopic(
        _.capitalize(name.trim()),
        Number(categoryId),
      );
      return c.json(newTopic, 201);
    } catch (error) {
      return c.json({ error: "Failed to add topic" }, 500);
    }
  }

  isValidCategoryId(value: string | undefined): boolean {
    if (value === undefined) {
      return true;
    }

    return Number(value) > 0;
  }
}
