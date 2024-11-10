-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
