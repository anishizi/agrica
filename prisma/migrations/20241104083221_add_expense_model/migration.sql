-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
