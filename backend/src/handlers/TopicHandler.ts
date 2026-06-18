import { Context, TypedResponse } from "@hono/hono";
import { Topic, CreateTopicDTO } from "../types/topic.ts";
import _ from "lodash";
import { IService } from "../services/IService.ts";
import { Category, CreateCategoryDTO } from "../types/category.ts";
import { IValidationService } from "../services/IValidationService.ts";

export class TopicHandler {
  private topicService: IService<Topic, CreateTopicDTO>;
  private categoryService: IService<Category, CreateCategoryDTO>;
  private validationService: IValidationService;

  constructor(topicService: IService<Topic, CreateTopicDTO>, categoryService: IService<Category, CreateCategoryDTO>, validationService: IValidationService) {
    this.topicService = topicService;
    this.categoryService = categoryService;
    this.validationService = validationService;

    // bind methods
    this.getTopics = this.getTopics.bind(this);
    this.addTopic = this.addTopic.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
  }

  async getTopics(
    c: Context,
  ): Promise<TypedResponse<Topic[]> | TypedResponse<{ error: string }>> {
    try {
      const categoryId = c.req.query("categoryId");

      const isValidCategoryId: boolean = this.validationService.isValidWhenProvided(categoryId);

      if (!isValidCategoryId) {
        return c.json({ error: "Invalid categoryId" }, 400);
      }

      if (
        categoryId !== undefined &&
        !(await this.categoryService.existsAsync(Number(categoryId)))
      ) {
        return c.json(
          { error: `Category not found with Id : ${categoryId}` },
          404,
        );
      }

      const topics = await this.topicService.getAllAsync({ categoryId: categoryId ? Number(categoryId) : undefined });

      return c.json(topics);
    } catch (_error) {
      return c.json({ error: "Failed to fetch topics" }, 500);
    }
  }

  async addTopic(
    c: Context,
  ): Promise<TypedResponse<Topic> | TypedResponse<{ error: string }>> {
    const { name, categoryId } = await c.req.json();

    const isValidCategoryId: boolean = this.validationService.isValidWhenProvided(categoryId);

    if (!isValidCategoryId) {
      return c.json({ error: "Invalid categoryId" }, 400);
    }

    if (!this.validationService.isNonEmptyString(name)) {
      return c.json({ error: "Invalid topic name" }, 400);
    }

    try {
      if (!(await this.categoryService.existsAsync(Number(categoryId)))) {
        return c.json(
          { error: `Category not found with Id : ${categoryId}` },
          404,
        );
      }

      const existingTopics = await this.topicService.getAllAsync({ categoryId: categoryId ? Number(categoryId) : undefined });
      const topicExists = existingTopics.some(
        (topic: Topic) => topic.name === _.capitalize(name.trim()),
      );

      if (topicExists) {
        return c.json({ error: "Topic already exists" }, 400);
      }

      const createTopicDTO: CreateTopicDTO = {
        name: _.capitalize(name.trim()),
        categoryId: Number(categoryId),
      };

      const newTopic = await this.topicService.createAsync(createTopicDTO);
      return c.json(newTopic, 201);
    } catch (_error) {
      return c.json({ error: "Failed to add topic" }, 500);
    }
  }

  async deleteTopic(
    c: Context,
  ): Promise<
    TypedResponse<{ message: string }> | TypedResponse<{ error: string }>
  > {
    const id = c.req.param("id");

    if (!this.validationService.isValidPositiveInteger(id)) {
      return c.json({ error: "Invalid topic id." }, 400);
    }

    const topicId = Number(id);

    try {
      if (!(await this.topicService.existsAsync(topicId))) {
        return c.json({ error: "Topic does not exist." }, 404);
      }

      await this.topicService.deleteAsync(topicId);

      return c.json({ message: "Topic deleted successfully." });
    } catch {
      return c.json({ error: "Failed to delete topic" }, 500);
    }
  }
}
