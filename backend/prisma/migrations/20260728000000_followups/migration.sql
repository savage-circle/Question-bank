-- CreateTable
CREATE TABLE "FollowUps" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "questionString" TEXT NOT NULL,

    CONSTRAINT "FollowUps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FollowUps" ADD CONSTRAINT "FollowUps_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
