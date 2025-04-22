-- CreateEnum
CREATE TYPE "FolderRole" AS ENUM ('ROOT', 'REGULAR');

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "role" "FolderRole" NOT NULL DEFAULT 'REGULAR';
