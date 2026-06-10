import { PrismaClient } from "../generated/prisma/client.ts";
import { QuestionFilters, QuestionWithTopic, UpdateQuestionRequest } from "../types/question.ts";

export class QuestionService {
  private prisma: PrismaClient;
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
  
  async isQuestionExists(id: number): Promise<boolean> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { id: true },
    });

    return question !== null;
  }

  async updateQuestion(
    id: number,
    data: UpdateQuestionRequest
  ): Promise<void> {
    await this.prisma.question.update({
      where: { id },
      data: { ...data , extensions: data.extensions ? JSON.stringify(data.extensions) : null },
    });
  }
}
