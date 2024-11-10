/*
  Warnings:

  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectProgress" ALTER COLUMN "progressPercentage" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
