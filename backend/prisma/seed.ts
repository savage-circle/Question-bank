import  prisma  from "../src/lib/prisma.ts";

async function main() {
  const result = await prisma.Categories.createMany({
    data: [
      { name: 'Maths' },
      { name: 'Coding' }
    ],
    skipDuplicates: true
  })

  console.log(result);
}


main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())