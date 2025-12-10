/*
  Warnings:

  - Added the required column `owner_id` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
