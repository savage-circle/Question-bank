import  prisma  from "../src/lib/prisma.ts";

async function main() {
  await prisma.categories?.createMany({
    data: [
      { name: 'Maths' },
      { name: 'Coding' }
    ],
    skipDuplicates: true
  })

}


main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())