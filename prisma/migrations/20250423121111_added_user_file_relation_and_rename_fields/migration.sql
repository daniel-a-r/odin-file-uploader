/*
  Warnings:

  - Added the required column `userId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "folderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
