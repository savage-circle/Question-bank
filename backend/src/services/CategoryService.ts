import { PrismaClient } from "../generated/prisma/client.ts";
import { Category, CreateCategoryDTO } from "../types/category.ts";
import { ICategoryService } from "./ICategoryService.ts";

export class CategoryService implements ICategoryService {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllAsync(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  getByIdAsync(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async existsAsync(id: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    return category !== null;
  }

  async existsByNameAsync(name: string, excludeId?: number): Promise<boolean> {
    console.log("inside existsByNameAsync", name, excludeId);
    const category = await this.prisma.category.findFirst({
      where: {
        name,
        ...(excludeId !== undefined ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    console.log("category", category);
    return category !== null;
  }

  createAsync(data: CreateCategoryDTO): Promise<Category> {
    const { name } = data;
    console.log("The data in createAync", name);
    return this.prisma.category.create({
      data: {
        name,
      },
    });
  }

  updateAsync(id: number, data: CreateCategoryDTO): Promise<Category> {
    const { name } = data;
    return this.prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  deleteAsync(id: number): Promise<void> {
    return this.prisma.category
      .delete({
        where: { id },
      })
      .then(() => {});
  }
}
