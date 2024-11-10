/*
  Warnings:

  - You are about to drop the column `endDate` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `installmentAmount` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the `CreditInstallment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CreditToCreditInstallment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shareAmount` to the `CreditContributor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditInstallment" DROP CONSTRAINT "CreditInstallment_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "_CreditToCreditInstallment" DROP CONSTRAINT "_CreditToCreditInstallment_A_fkey";

-- DropForeignKey
ALTER TABLE "_CreditToCreditInstallment" DROP CONSTRAINT "_CreditToCreditInstallment_B_fkey";

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "endDate",
DROP COLUMN "installmentAmount",
DROP COLUMN "startDate",
DROP COLUMN "totalAmount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CreditContributor" ADD COLUMN     "hasPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareAmount" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "CreditInstallment";

-- DropTable
DROP TABLE "_CreditToCreditInstallment";

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" SERIAL NOT NULL,
    "contributorId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountPaid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "CreditContributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
