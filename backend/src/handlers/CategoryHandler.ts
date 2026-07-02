import { Context, TypedResponse } from "@hono/hono";
import _ from "lodash";
import { Category } from "../types/category.ts";
import { ICategoryService } from "../services/ICategoryService.ts";
import { IValidationService } from "../services/IValidationService.ts";

export class CategoryHandler {
  private readonly categoriesService: ICategoryService;
  private readonly validationService: IValidationService;

  constructor(
    categoriesService: ICategoryService,
    validationService: IValidationService,
  ) {
    this.categoriesService = categoriesService;
    this.validationService = validationService;

    // bind methods
    this.getCategories = this.getCategories.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
  }

  async getCategories(c: Context): Promise<TypedResponse<Category[]>> {
    const categories = await this.categoriesService.getAllAsync();
    return c.json(categories);
  }

  async createCategory(
    c: Context,
  ): Promise<TypedResponse<Category> | TypedResponse<{ error: string }>> {
    const { categoryName } = await c.req.json();

    const inputValidation =
      this.validationService.validateCreateCategoryInput(categoryName);
    if (!inputValidation.isValid) {
      return c.json({ error: inputValidation.error! }, 400);
    }

    try {
      const normalizedName = _.capitalize(categoryName.trim());
      const duplicateExists =
        await this.categoriesService.existsByNameAsync(normalizedName);
      if (duplicateExists) {
        return c.json({ error: "Category name already exists." }, 409);
      }

      const created = await this.categoriesService.createAsync({
        name: normalizedName,
      });

      return c.json(created, 201);
    } catch {
      return c.json({ error: "Failed to create category" }, 500);
    }
  }

  async updateCategory(
    c: Context,
  ): Promise<TypedResponse<Category> | TypedResponse<{ error: string }>> {
    const id = c.req.param("id");
    const { categoryName } = await c.req.json();

    const inputValidation = this.validationService.validateUpdateCategoryInput(
      id,
      categoryName,
    );
    if (!inputValidation.isValid) {
      return c.json({ error: inputValidation.error! }, 400);
    }

    const categoryId = Number(id);

    try {
      if (!(await this.categoriesService.existsAsync(categoryId))) {
        return c.json({ error: "Category does not exist." }, 404);
      }

      const normalizedName = _.capitalize(categoryName.trim());
      const duplicateExists = await this.categoriesService.existsByNameAsync(
        normalizedName,
        categoryId,
      );

      if (duplicateExists) {
        return c.json({ error: "Category name already exists." }, 409);
      }

      const updated = await this.categoriesService.updateAsync(categoryId, {
        name: normalizedName,
      });

      return c.json(updated);
    } catch {
      return c.json({ error: "Failed to update category" }, 500);
    }
  }
}
