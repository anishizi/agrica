-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "months" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
