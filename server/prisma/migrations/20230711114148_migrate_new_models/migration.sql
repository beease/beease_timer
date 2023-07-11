/*
  Warnings:

  - You are about to drop the column `userId` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Workspace` table. All the data in the column will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MemberToProject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[credentialId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credentialId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_userId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_MemberToProject" DROP CONSTRAINT "_MemberToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemberToProject" DROP CONSTRAINT "_MemberToProject_B_fkey";

-- DropIndex
DROP INDEX "Credential_userId_key";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdAt",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credentialId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "createdAt";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "_MemberToProject";

-- CreateTable
CREATE TABLE "memberWorkspace" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "memberWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberSession" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "projectId" TEXT,
    "memberWorkspaceId" TEXT,

    CONSTRAINT "memberSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_credentialId_key" ON "User"("credentialId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberWorkspace" ADD CONSTRAINT "memberWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberWorkspace" ADD CONSTRAINT "memberWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberSession" ADD CONSTRAINT "memberSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberSession" ADD CONSTRAINT "memberSession_memberWorkspaceId_fkey" FOREIGN KEY ("memberWorkspaceId") REFERENCES "memberWorkspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
