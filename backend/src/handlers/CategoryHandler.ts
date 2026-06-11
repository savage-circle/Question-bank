import { Context, TypedResponse } from "@hono/hono";
import { Category, CreateCategoryDTO } from "../types/category.ts";
import { IService } from "../services/IService.ts";

export class CategoryHandler {
  private readonly categoriesService: IService<Category, CreateCategoryDTO>;
  constructor(categoriesService: IService<Category, CreateCategoryDTO>) {
    this.categoriesService = categoriesService;

    // bind methods
    this.getCategories = this.getCategories.bind(this);
  }

  async getCategories(c: Context): Promise<TypedResponse<Category[]>> {
    const categories = await this.categoriesService.getAllAsync();
    return c.json(categories);
  }
}
