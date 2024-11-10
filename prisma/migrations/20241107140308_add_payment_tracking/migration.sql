-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
