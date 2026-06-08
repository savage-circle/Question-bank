import { PrismaClient } from "../generated/prisma/client.ts";
import { Topic } from "../types/topic.ts";

export class TopicService {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getTopics(categoryId?: number): Promise<Topic[]> {
    return this.prisma.Topic.findMany({
      where: categoryId !== undefined ? { categoryId } : undefined,
    });
  }
  addTopic(name: string, categoryId: number) : Promise<Topic> {
    return this.prisma.Topic.create({
      data: {
        name,
        categoryId,
      },
    });
  }
}