/*
  Warnings:

  - You are about to drop the column `amount` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `months` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installmentAmount` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Credit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_creditId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "amount",
DROP COLUMN "months",
DROP COLUMN "updatedAt",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "installmentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "CreditContributor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "creditId" INTEGER NOT NULL,

    CONSTRAINT "CreditContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditInstallment" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentDate" TIMESTAMP(3),
    "contributorId" INTEGER NOT NULL,

    CONSTRAINT "CreditInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CreditToCreditInstallment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CreditToCreditInstallment_AB_unique" ON "_CreditToCreditInstallment"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditToCreditInstallment_B_index" ON "_CreditToCreditInstallment"("B");

-- AddForeignKey
ALTER TABLE "CreditContributor" ADD CONSTRAINT "CreditContributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditContributor" ADD CONSTRAINT "CreditContributor_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditInstallment" ADD CONSTRAINT "CreditInstallment_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "CreditContributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditToCreditInstallment" ADD CONSTRAINT "_CreditToCreditInstallment_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditToCreditInstallment" ADD CONSTRAINT "_CreditToCreditInstallment_B_fkey" FOREIGN KEY ("B") REFERENCES "CreditInstallment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
