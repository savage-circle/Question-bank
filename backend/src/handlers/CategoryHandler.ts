import { Context, TypedResponse } from "@hono/hono";
import _ from "lodash";
import {
  Category,
  CategoryUpdateResponse,
  CreateCategoryDTO,
} from "../types/category.ts";
import { IService } from "../services/IService.ts";
import { IValidationService } from "../services/IValidationService.ts";

export class CategoryHandler {
  private readonly categoriesService: IService<Category, CreateCategoryDTO>;
  private readonly validationService: IValidationService;

  constructor(
    categoriesService: IService<Category, CreateCategoryDTO>,
    validationService: IValidationService,
  ) {
    this.categoriesService = categoriesService;
    this.validationService = validationService;

    // bind methods
    this.getCategories = this.getCategories.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
  }

  async getCategories(c: Context): Promise<TypedResponse<Category[]>> {
    const categories = await this.categoriesService.getAllAsync();
    return c.json(categories);
  }

  async updateCategory(
    c: Context,
  ): Promise<
    TypedResponse<CategoryUpdateResponse> | TypedResponse<{ error: string }>
  > {
    const id = c.req.param("id");
    const { categoryName } = await c.req.json();

    const inputValidation =
      this.validationService.validateUpdateCategoryInput(id, categoryName);
    if (!inputValidation.isValid) {
      return c.json({ error: inputValidation.error! }, 400);
    }

    const categoryId = Number(id);

    try {
      if (!(await this.categoriesService.existsAsync(categoryId))) {
        return c.json({ error: "Category does not exist." }, 404);
      }

      const normalizedName = _.capitalize(categoryName.trim());
      const existingCategories = await this.categoriesService.getAllAsync();
      const duplicateExists = existingCategories.some(
        (cat: Category) => cat.name === normalizedName && cat.id !== categoryId,
      );

      if (duplicateExists) {
        return c.json({ error: "Category name already exists." }, 409);
      }

      const updated = await this.categoriesService.updateAsync(categoryId, {
        name: normalizedName,
      });

      return c.json({ id: updated.id, name: updated.name });
    } catch {
      return c.json({ error: "Failed to update category" }, 500);
    }
  }
}
