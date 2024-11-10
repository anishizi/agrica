/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "createdAt",
DROP COLUMN "isPaid",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
