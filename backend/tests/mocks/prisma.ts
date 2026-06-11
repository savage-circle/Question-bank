import { spy } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { PrismaClient } from "../../src/generated/prisma/client.ts";

export class MockPrisma {
  static create(
    data: Record<string, unknown> = {},
  ): PrismaClient {
    const prisma = {
      category: {
        findMany: spy(() => Promise.resolve([])),
        findUnique: spy(() => Promise.resolve(null)),
        create: spy(() => Promise.resolve({ id: 1, name: "Category 1" })),
        update: spy(() => Promise.resolve({ id: 1, name: "Category 1" })),
        delete: spy(() => Promise.resolve()),
      },
      topic: {
        findMany: spy(() => Promise.resolve([])),
        findUnique: spy(() => Promise.resolve(null)),
        create: spy(() =>
          Promise.resolve({ id: 1, name: "Topic 1", categoryId: 1 })
        ),
        update: spy(() =>
          Promise.resolve({ id: 1, name: "Topic 1", categoryId: 1 })
        ),
        delete: spy(() => Promise.resolve()),
      },
      question: {
        findMany: spy(() => Promise.resolve([])),
        findUnique: spy(() => Promise.resolve(null)),
        create: spy(() =>
          Promise.resolve({
            id: 1,
            description: "Question 1",
            topicId: 1,
            levelId: 1,
            extensions: null,
            topic: { id: 1, name: "Topic 1", categoryId: 1 },
          })
        ),
        update: spy(() =>
          Promise.resolve({
            id: 1,
            description: "Question 1",
            topicId: 1,
            levelId: 1,
            extensions: null,
            topic: { id: 1, name: "Topic 1", categoryId: 1 },
          })
        ),
        delete: spy(() => Promise.resolve()),
      },
      ...data,
    } as unknown as PrismaClient;

    return prisma;
  }
}