/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `family_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `given_name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "family_name" SET NOT NULL,
ALTER COLUMN "given_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "color" DROP DEFAULT;
