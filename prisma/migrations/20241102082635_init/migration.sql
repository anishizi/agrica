-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assignedTo" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProgress" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "progressPercentage" INTEGER NOT NULL,
    "dateRecorded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProgress" ADD CONSTRAINT "ProjectProgress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
