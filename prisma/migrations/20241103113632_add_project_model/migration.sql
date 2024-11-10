-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
