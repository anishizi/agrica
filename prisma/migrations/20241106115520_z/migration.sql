/*
  Warnings:

  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreditContributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditContributor" DROP CONSTRAINT "CreditContributor_creditId_fkey";

-- DropForeignKey
ALTER TABLE "CreditContributor" DROP CONSTRAINT "CreditContributor_userId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyPayment" DROP CONSTRAINT "MonthlyPayment_contributorId_fkey";

-- DropTable
DROP TABLE "Credit";

-- DropTable
DROP TABLE "CreditContributor";

-- DropTable
DROP TABLE "MonthlyPayment";
