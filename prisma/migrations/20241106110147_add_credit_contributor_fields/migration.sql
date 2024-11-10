/*
  Warnings:

  - Added the required column `shareAmount` to the `CreditContributor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditContributor" ADD COLUMN     "shareAmount" DOUBLE PRECISION NOT NULL;
