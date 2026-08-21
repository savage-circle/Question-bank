import { PrismaClient } from "../../src/generated/prisma/client.ts";

export const resetSeedData = async (prisma: PrismaClient) => {
  await prisma.followUps.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.category.deleteMany();
};
