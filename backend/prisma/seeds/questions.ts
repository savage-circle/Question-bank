import { PrismaClient } from "../../src/generated/prisma/client.ts";
import LevelType from "../../src/enums/levelType.ts";

export const seedQuestions = async (prisma: PrismaClient) => {
  const oops = await prisma.topic.findFirst({ where: { name: "OOPs" } });
  const dataStructures = await prisma.topic.findFirst({
    where: { name: "Data Structures" },
  });
  const algebra = await prisma.topic.findFirst({ where: { name: "Algebra" } });

  if (!oops || !dataStructures || !algebra) {
    throw new Error("Topics must be seeded before questions");
  }

  await prisma.question.createMany({
    data: [
      {
        description: "Explain the concept of polymorphism.",
        topicId: oops.id,
        levelId: LevelType.MEDIUM,
      },
      {
        description: "What is encapsulation?",
        topicId: oops.id,
        levelId: LevelType.EASY,
      },
      {
        description: "Explain virtual inheritance and the diamond problem.",
        topicId: oops.id,
        levelId: LevelType.HARD,
      },
      {
        description: "How does a hash map handle collisions?",
        topicId: dataStructures.id,
        levelId: LevelType.MEDIUM,
      },
      {
        description: "What is a stack?",
        topicId: dataStructures.id,
        levelId: LevelType.EASY,
      },
      {
        description: "Solve for x: 2x + 3 = 7.",
        topicId: algebra.id,
        levelId: LevelType.EASY,
      },
      {
        description: "Prove the quadratic formula by completing the square.",
        topicId: algebra.id,
        levelId: LevelType.HARD,
      },
    ],
    skipDuplicates: true,
  });
};
