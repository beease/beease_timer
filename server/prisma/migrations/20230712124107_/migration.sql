/*
  Warnings:

  - A unique constraint covering the columns `[invitedId,inviterId,workspaceId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,userId]` on the table `memberWorkspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "dailyPrice" DROP NOT NULL,
ALTER COLUMN "dailyPrice" DROP DEFAULT,
ALTER COLUMN "hourByDay" DROP NOT NULL,
ALTER COLUMN "hourByDay" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_invitedId_inviterId_workspaceId_key" ON "Invitation"("invitedId", "inviterId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "memberWorkspace_workspaceId_userId_key" ON "memberWorkspace"("workspaceId", "userId");
