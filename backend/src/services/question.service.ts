import { PrismaClient, Question } from "../generated/prisma/client.ts";
import { QuestionFilters, QuestionWithTopic } from "../types/question.ts";

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

  async deleteQuestion(questionId: number): Promise<Question> {
    const response = await this.prisma.question.delete({
      where: { id: questionId },
    }); 

    return response;
  }
}
