/*
  Warnings:

  - A unique constraint covering the columns `[currentSessionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_currentSessionId_key" ON "User"("currentSessionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentSessionId_fkey" FOREIGN KEY ("currentSessionId") REFERENCES "memberSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
