import { PrismaClient, Question } from "../generated/prisma/client.ts";
import {
  QuestionFilters,
  QuestionWithTopic,
  QuestionRequest,
} from "../types/question.ts";

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

  async isQuestionExists(id: number): Promise<boolean> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { id: true },
    });

    return question !== null;
  }

  async updateQuestion(id: number, data: QuestionRequest): Promise<void> {
    const updatedExtensions = data.extensions?.map((ext) => ext.trim()).filter((ext) => ext.length > 0);

    await this.prisma.question.update({
      where: { id },
      data: {
        ...data,
        extensions: updatedExtensions ? JSON.stringify(updatedExtensions) : null,
      },
    });
  }
}
