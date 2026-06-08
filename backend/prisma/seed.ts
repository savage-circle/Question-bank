import  prisma  from "../src/lib/prisma.ts";

const main = async () => {
  await prisma.categories.createMany({
    data: [
      { name: 'Maths' },
      { name: 'Coding' }
    ],
    skipDuplicates: true
  })

  console.log("Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());