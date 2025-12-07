/*
  Warnings:

  - The primary key for the `Geometry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `type` on the `Geometry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Geometry" DROP CONSTRAINT "Geometry_pkey",
DROP COLUMN "type",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Geometry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Geometry_id_seq";

-- DropEnum
DROP TYPE "public"."Type";
