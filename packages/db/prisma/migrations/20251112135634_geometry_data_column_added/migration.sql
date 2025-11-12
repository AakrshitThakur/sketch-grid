/*
  Warnings:

  - Added the required column `data` to the `Geometry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Geometry" ADD COLUMN     "data" JSONB NOT NULL;
