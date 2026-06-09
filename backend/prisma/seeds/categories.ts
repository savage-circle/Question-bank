import { PrismaClient } from "../../src/generated/prisma/client.ts";

export const seedCategories = async (prisma: PrismaClient) => {
  await prisma.category.createMany({
    data: [
      { name: "Maths" },
      { name: "Coding" },
    ],
    skipDuplicates: true,
  });
};
