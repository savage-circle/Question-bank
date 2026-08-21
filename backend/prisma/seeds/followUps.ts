import { PrismaClient } from "../../src/generated/prisma/client.ts";
import LevelType from "../../src/enums/levelType.ts";

const followUpSeedData = [
  {
    questionDescription: "Explain the concept of polymorphism.",
    levelId: LevelType.EASY,
    description: "Can you compare runtime and compile-time polymorphism?",
    question: "What is a simple real-world example of polymorphism?",
  },
  {
    questionDescription: "What is encapsulation?",
    levelId: LevelType.EASY,
    description: "How does encapsulation improve maintainability?",
    question: "Why is data hiding important in OOP?",
  },
  {
    questionDescription: "How does a hash map handle collisions?",
    levelId: LevelType.MEDIUM,
    description: "What are the trade-offs between chaining and probing?",
    question: "How would you explain collision resolution to a beginner?",
  },
  {
    questionDescription: "Solve for x: 2x + 3 = 7.",
    levelId: LevelType.EASY,
    description: "Can you show the step-by-step solution?",
    question: "What is the value of x in this equation?",
  },
  {
    questionDescription: "Explain virtual inheritance and the diamond problem.",
    levelId: LevelType.HARD,
    description:
      "What does the compiler generate differently for a virtual base class?",
    question:
      "How would you demonstrate the diamond problem with a small class hierarchy?",
  },
  {
    questionDescription: "What is a stack?",
    levelId: LevelType.EASY,
    description: "Can you name real-world use cases for a stack?",
    question: "How is a stack different from a queue?",
  },
  {
    questionDescription:
      "Prove the quadratic formula by completing the square.",
    levelId: LevelType.HARD,
    description:
      "What is the discriminant and what does it tell you about the roots?",
    question:
      "Can you walk through completing the square for ax^2 + bx + c = 0?",
  },
];

export const seedFollowUps = async (prisma: PrismaClient) => {
  const questionDescriptions = followUpSeedData.map(
    (item) => item.questionDescription,
  );
  const questions = await prisma.question.findMany({
    where: {
      description: {
        in: questionDescriptions,
      },
    },
  });

  const questionMap = new Map(
    questions.map((question) => [question.description, question.id]),
  );

  for (const item of followUpSeedData) {
    const questionId = questionMap.get(item.questionDescription);

    if (!questionId) {
      continue;
    }

    const existingFollowUp = await prisma.followUps.findFirst({
      where: {
        questionId,
        question: item.question,
      },
    });

    if (!existingFollowUp) {
      await prisma.followUps.create({
        data: {
          questionId,
          levelId: item.levelId,
          description: item.description,
          question: item.question,
        },
      });
    }
  }
};
