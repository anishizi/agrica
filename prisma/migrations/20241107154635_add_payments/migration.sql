/*
  Warnings:

  - A unique constraint covering the columns `[userId,creditId,month,year]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_userId_creditId_month_year_key" ON "Payment"("userId", "creditId", "month", "year");
