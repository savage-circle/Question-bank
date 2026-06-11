import { PrismaClient } from "../generated/prisma/client.ts";
import { CreateTopicDTO, Topic } from "../types/topic.ts";
import { IService } from "./IService.ts";

export class TopicService implements IService<Topic, CreateTopicDTO> {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllAsync(options?: Record<string, number | undefined>): Promise<Topic[]> {
    const { categoryId } = options || {};

    return this.prisma.topic.findMany({
      where : categoryId ? { categoryId } : undefined,
    });
  }

  getByIdAsync(id: number): Promise<Topic | null> {
    return this.prisma.topic.findUnique({
      where: { id },
    });
  }

  async existsAsync(id: number): Promise<boolean> {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      select: { id: true },
    });
    return topic !== null;
  }

  createAsync(data: CreateTopicDTO): Promise<Topic> {
    const { name, categoryId } = data;
    return this.prisma.topic.create({
      data: {
        name,
        categoryId,
      },
    });
  }

  updateAsync(id: number, data: CreateTopicDTO): Promise<Topic> {
    const { name, categoryId } = data;
    return this.prisma.topic.update({
      where: { id },
      data: {
        name,
        categoryId,
      },
    });
  }

  deleteAsync(id: number): Promise<void> {
    return this.prisma.topic.delete({
      where: { id },
    }).then(() => {});
  }
}