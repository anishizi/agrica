-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "monthsToRepay" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserCredits" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserCredits_AB_unique" ON "_UserCredits"("A", "B");

-- CreateIndex
CREATE INDEX "_UserCredits_B_index" ON "_UserCredits"("B");

-- AddForeignKey
ALTER TABLE "_UserCredits" ADD CONSTRAINT "_UserCredits_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCredits" ADD CONSTRAINT "_UserCredits_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
