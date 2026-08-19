import prisma from "../src/lib/prisma.ts";
import { seedCategories } from "./seeds/categories.ts";
import { seedTopics } from "./seeds/topics.ts";
import { seedQuestions } from "./seeds/questions.ts";
import { seedFollowUps } from "./seeds/followUps.ts";
import { resetSeedData } from "./seeds/reset.ts";

const main = async () => {
  if (Deno.args.includes("--reset")) {
    await resetSeedData(prisma);
    console.log("Existing seed data wiped");
  }

  await seedCategories(prisma);
  await seedTopics(prisma);
  await seedQuestions(prisma);
  await seedFollowUps(prisma);

  console.log("Database seeded successfully");
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
