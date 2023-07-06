/*
  Warnings:

  - Made the column `password` on table `Credential` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Credential" ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "family_name" DROP NOT NULL;
