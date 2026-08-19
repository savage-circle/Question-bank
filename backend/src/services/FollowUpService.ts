import { PrismaClient } from "../generated/prisma/client.ts";
import { IService } from "./IService.ts";
import { CreateFollowUpDTO, FollowUp } from "../types/followUp.ts";

export class FollowUpService implements IService<FollowUp, CreateFollowUpDTO> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllAsync(
    options?: Record<string, number | undefined>,
  ): Promise<FollowUp[]> {
    const { questionId } = options || {};

    return this.prisma.followUps.findMany({
      where: questionId !== undefined ? { questionId } : {},
      include: {
        question: true,
      },
    });
  }

  getByIdAsync(id: number): Promise<FollowUp | null> {
    return this.prisma.followUps.findUnique({
      where: { id },
      include: {
        question: true,
      },
    });
  }

  async existsAsync(id: number): Promise<boolean> {
    const followUp = await this.prisma.followUps.findUnique({
      where: { id },
      select: { id: true },
    });

    return followUp !== null;
  }

  createAsync(data: CreateFollowUpDTO): Promise<FollowUp> {
    return this.prisma.followUps.create({
      data,
      include: {
        question: true,
      },
    });
  }

  updateAsync(id: number, data: CreateFollowUpDTO): Promise<FollowUp> {
    return this.prisma.followUps.update({
      where: { id },
      data,
      include: {
        question: true,
      },
    });
  }

  deleteAsync(id: number): Promise<void> {
    return this.prisma.followUps.delete({ where: { id } }).then(() => {});
  }
}
