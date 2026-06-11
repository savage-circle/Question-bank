import { PrismaClient } from "../generated/prisma/client.ts";
import { CreateQuestionDTO, Question } from "../types/question.ts";
import { IService } from "./IService.ts";

export class QuestionService implements IService<Question, CreateQuestionDTO> {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllAsync(options?: Record<string, number | undefined>): Promise<Question[]> {
    const { categoryId, topicId, levelId } = options || {};

    return this.prisma.question.findMany({
      where: {
        ...(topicId !== undefined ? { topicId } : {}),
        ...(levelId !== undefined ? { levelId } : {}),
        ...(categoryId !== undefined ? { topic: { categoryId } } : {}),
      },
      include: {
        topic: true,
      },
    });
  }

  getByIdAsync(id: number): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        topic: true,
      },
    });
  }

  async existsAsync(id: number): Promise<boolean> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { id: true },
    });

    return question !== null;
  }

  createAsync(data: CreateQuestionDTO): Promise<Question> {
    const { description, topicId, levelId, extensions } = data;
    const extensionsString = extensions ? JSON.stringify(extensions) : null;

    return this.prisma.question.create({
      data: {
        description,
        topicId,
        levelId,
        extensions: extensionsString,
      },
      include: {
        topic: true,
      },
    });
  }

  updateAsync(id: number, data: CreateQuestionDTO): Promise<Question> {
    const { description, topicId, levelId, extensions } = data;
    const extensionsString = extensions ? JSON.stringify(extensions) : null;

    return this.prisma.question.update({
      where: { id },
      data: {
        description,
        topicId,
        levelId,
        extensions: extensionsString,
      },
      include: {
        topic: true,
      },
    });
  }

  deleteAsync(id: number): Promise<void> {
    return this.prisma.question
      .delete({
        where: { id },
      })
      .then(() => {});
  }
}
