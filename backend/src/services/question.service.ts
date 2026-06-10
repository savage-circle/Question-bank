import { PrismaClient } from "../generated/prisma/client.ts";
import {
  QuestionFilters,
  QuestionRequest,
  QuestionWithTopic,
} from "../types/question.ts";

export class QuestionService {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getQuestions(filters: QuestionFilters = {}): Promise<QuestionWithTopic[]> {
    const { categoryId, topicId, levelId } = filters;

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

  async questionExists(id: number): Promise<boolean> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { id: true },
    });

    return question !== null;
  }

  async updateQuestion(id: number, data: QuestionRequest): Promise<void> {
    const updatedExtensions = data.extensions
      ?.map((ext) => ext.trim())
      .filter((ext) => ext.length > 0);

    await this.prisma.question.update({
      where: { id },
      data: {
        description: data.description,
        topicId: data.topicId,
        levelId: data.levelId,
        extensions: updatedExtensions
          ? JSON.stringify(updatedExtensions)
          : null,
      },
    });
  }
}
