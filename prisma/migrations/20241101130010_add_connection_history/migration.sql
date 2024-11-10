-- CreateTable
CREATE TABLE "ConnectionHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "loggedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConnectionHistory" ADD CONSTRAINT "ConnectionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
