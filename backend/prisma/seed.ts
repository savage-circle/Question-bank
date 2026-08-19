import prisma from "../src/lib/prisma.ts";
import { seedCategories } from "./seeds/categories.ts";
import { seedTopics } from "./seeds/topics.ts";
import { seedQuestions } from "./seeds/questions.ts";
import { seedFollowUps } from "./seeds/followUps.ts";

const main = async () => {
  await seedCategories(prisma);
  await seedTopics(prisma);
  await seedQuestions(prisma);
  await seedFollowUps(prisma);

  console.log("Database seeded successfully");
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
