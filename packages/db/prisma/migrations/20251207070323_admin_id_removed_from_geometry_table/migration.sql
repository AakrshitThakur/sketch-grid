/*
  Warnings:

  - The values [BOX,CIRCLE] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `admin_id` on the `Geometry` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('box', 'circle', 'arrow', 'text', 'diamond');
ALTER TABLE "public"."Geometry" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Geometry" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "public"."Type_old";
ALTER TABLE "Geometry" ALTER COLUMN "type" SET DEFAULT 'box';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Geometry" DROP CONSTRAINT "Geometry_admin_id_fkey";

-- AlterTable
ALTER TABLE "Geometry" DROP COLUMN "admin_id",
ALTER COLUMN "type" SET DEFAULT 'box';
