-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_comment_id_fkey";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "comment_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
