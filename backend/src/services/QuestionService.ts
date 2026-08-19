import { PrismaClient } from "../generated/prisma/client.ts";
import { CreateQuestionDTO, Question } from "../types/question.ts";
import { CreateFollowUpDTO, FollowUpSummary } from "../types/followUp.ts";
import { IQuestionService } from "./IQuestionService.ts";

export class QuestionService implements IQuestionService {
  private prisma: PrismaClient;
  private readonly followUpSelect = {
    id: true,
    levelId: true,
    description: true,
    questionString: true,
  } as const;
  private readonly questionInclude = {
    topic: true,
    followUps: {
      select: this.followUpSelect,
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

  getFollowUpsAsync(questionId: number): Promise<FollowUpSummary[]> {
    return this.prisma.followUps.findMany({
      where: { questionId },
      select: this.followUpSelect,
    });
  }

  async followUpExistsAsync(followUpId: number, questionId: number): Promise<boolean> {
    const followUp = await this.prisma.followUps.findFirst({
      where: { id: followUpId, questionId },
      select: { id: true },
    });

    return followUp !== null;
  }

  addFollowUpAsync(questionId: number, data: CreateFollowUpDTO): Promise<FollowUpSummary> {
    return this.prisma.followUps.create({
      data: { questionId, ...data },
      select: this.followUpSelect,
    });
  }

  updateFollowUpAsync(followUpId: number, data: CreateFollowUpDTO): Promise<FollowUpSummary> {
    return this.prisma.followUps.update({
      where: { id: followUpId },
      data,
      select: this.followUpSelect,
    });
  }

  deleteFollowUpAsync(followUpId: number): Promise<void> {
    return this.prisma.followUps.delete({ where: { id: followUpId } }).then(() => {});
  }
}
