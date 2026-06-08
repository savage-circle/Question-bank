import { PrismaClient } from "../generated/prisma/client.ts";
import { Category } from "../types/category.ts";

export class CategoryService {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.prisma.Category.findMany();
    return categories;
  }

  async categoryExists(id: number): Promise<boolean> {
    const category = await this.prisma.Category.findUnique({
      where: { id },
      select: { id: true },
    });

    return category !== null;
  }
}
