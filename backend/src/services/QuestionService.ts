import { PrismaClient } from "../generated/prisma/client.ts";
import { CreateQuestionDTO, Question } from "../types/question.ts";
import { IService } from "./IService.ts";

export class QuestionService implements IService<Question, CreateQuestionDTO> {
  private prisma: PrismaClient;
  private readonly questionInclude = {
    topic: true,
    followUps: {
      select: {
        id: true,
        levelId: true,
        description: true,
        questionString: true,
      },
    },
  } as const;

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
      include: this.questionInclude,
    });
  }

  getByIdAsync(id: number): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: { id },
      include: this.questionInclude,
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
    const { description, topicId, levelId } = data;

    return this.prisma.question.create({
      data: {
        description,
        topicId,
        levelId,
      },
      include: this.questionInclude,
    });
  }

  updateAsync(id: number, data: CreateQuestionDTO): Promise<Question> {
    const { description, topicId, levelId } = data;

    return this.prisma.question.update({
      where: { id },
      data: {
        description,
        topicId,
        levelId,
      },
      include: this.questionInclude,
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
