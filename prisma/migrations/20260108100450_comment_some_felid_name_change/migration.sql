/*
  Warnings:

  - You are about to drop the column `comment_id` on the `comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_comment_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "comment_id",
ADD COLUMN     "parent_id" TEXT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
