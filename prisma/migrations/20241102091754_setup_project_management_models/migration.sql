/*
  Warnings:

  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectProgress" DROP CONSTRAINT "ProjectProgress_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropTable
DROP TABLE "Expense";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectProgress";

-- DropTable
DROP TABLE "Task";
