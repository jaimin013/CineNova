/*
  Warnings:

  - Made the column `videoUrl` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "videoUrl" SET NOT NULL;
