/*
  Warnings:

  - You are about to drop the column `folderId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "folderId",
DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "folderId",
DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
