import { PrismaClient, Question } from "../generated/prisma/client.ts";

export class QuestionsService {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async deleteQuestion(questionId: number): Promise<Question> {
    const response = await this.prisma.question.delete({
      where: { id: questionId },
    }); 

    return response;
  }
}