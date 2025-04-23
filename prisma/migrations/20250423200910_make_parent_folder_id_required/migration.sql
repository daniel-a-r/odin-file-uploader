/*
  Warnings:

  - Made the column `folderId` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderId_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "folderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
