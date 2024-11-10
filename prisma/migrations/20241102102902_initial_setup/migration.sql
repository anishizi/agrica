/*
  Warnings:

  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropTable
DROP TABLE "Expense";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "Task";
