import prisma from "../src/lib/prisma.ts";
import { seedCategories } from "./seeds/categories.ts";
import { seedTopics } from "./seeds/topics.ts";
import { seedQuestions } from "./seeds/questions.ts";

const main = async () => {
  await seedCategories(prisma);
  await seedTopics(prisma);
  await seedQuestions(prisma);

  console.log("Database seeded successfully");
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
