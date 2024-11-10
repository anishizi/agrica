/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `hasPaid` on the `CreditContributor` table. All the data in the column will be lost.
  - You are about to drop the column `shareAmount` on the `CreditContributor` table. All the data in the column will be lost.
  - You are about to drop the `PaymentRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyAmount` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyShare` to the `CreditContributor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalShareAmount` to the `CreditContributor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentRecord" DROP CONSTRAINT "PaymentRecord_contributorId_fkey";

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "dueDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "monthlyAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CreditContributor" DROP COLUMN "hasPaid",
DROP COLUMN "shareAmount",
ADD COLUMN     "monthlyShare" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalShareAmount" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "PaymentRecord";

-- CreateTable
CREATE TABLE "MonthlyPayment" (
    "id" SERIAL NOT NULL,
    "contributorId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3),

    CONSTRAINT "MonthlyPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonthlyPayment" ADD CONSTRAINT "MonthlyPayment_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "CreditContributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
