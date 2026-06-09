import { PrismaClient } from "../generated/prisma/client.ts";
import { Category } from "../types/category.ts";

export class CategoriesService {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    return categories;
  }
}
