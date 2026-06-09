import { PrismaClient } from "../../src/generated/prisma/client.ts";

export const seedTopics = async (prisma: PrismaClient) => {
  const coding = await prisma.category.findFirst({ where: { name: "Coding" } });
  const maths = await prisma.category.findFirst({ where: { name: "Maths" } });

  if (!coding || !maths) {
    throw new Error("Categories must be seeded before topics");
  }

  await prisma.topic.createMany({
    data: [
      { name: "OOPs", categoryId: coding.id },
      { name: "Data Structures", categoryId: coding.id },
      { name: "Algebra", categoryId: maths.id },
    ],
    skipDuplicates: true,
  });
};
