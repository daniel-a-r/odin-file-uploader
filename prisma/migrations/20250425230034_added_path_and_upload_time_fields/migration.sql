/*
  Warnings:

  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadTime` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "uploadTime" INTEGER NOT NULL;
