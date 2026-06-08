import { Context, TypedResponse } from "@hono/hono";
import { CategoriesService } from "../services/categories.service.ts";
import { Category } from "../types/category.ts";

export class CategoriesHandler {
  private readonly categoriesService: CategoriesService;
  constructor(categoriesService: CategoriesService) {
    this.categoriesService = categoriesService;

    // bind methods
    this.getCategories = this.getCategories.bind(this);
  }

  async getCategories(c: Context): Promise<TypedResponse<Category[]>> {
    const categories = await this.categoriesService.getCategories();
    return c.json(categories);
  }
}
