/*
  Warnings:

  - You are about to drop the column `invitedId` on the `Invitation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invitedMail,inviterId,workspaceId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invitedMail` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_invitedId_fkey";

-- DropIndex
DROP INDEX "Invitation_invitedId_inviterId_workspaceId_key";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "invitedId",
ADD COLUMN     "invitedMail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_invitedMail_inviterId_workspaceId_key" ON "Invitation"("invitedMail", "inviterId", "workspaceId");
