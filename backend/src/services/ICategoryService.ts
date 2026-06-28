import { Category, CreateCategoryDTO } from "../types/category.ts";
import { IService } from "./IService.ts";

export interface ICategoryService extends IService<Category, CreateCategoryDTO> {
  existsByNameAsync(name: string, excludeId?: number): Promise<boolean>;
}