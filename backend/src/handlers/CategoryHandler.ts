import { Context, TypedResponse } from "@hono/hono";
import { CategoryService } from "../services/category.service.ts";
import { Category } from "../types/category.ts";

export class CategoryHandler {
  private readonly categoriesService: CategoryService;
  constructor(categoriesService: CategoryService) {
    this.categoriesService = categoriesService;

    // bind methods
    this.getCategories = this.getCategories.bind(this);
  }

  async getCategories(
    c: Context,
  ): Promise<TypedResponse<Category[]> | TypedResponse<{ error: string }>> {
    try {
      const categories = await this.categoriesService.getCategories();
      return c.json(categories);
    } catch (_error) {
      return c.json({ error: "Failed to fetch categories" }, 500);
    }
  }
}
