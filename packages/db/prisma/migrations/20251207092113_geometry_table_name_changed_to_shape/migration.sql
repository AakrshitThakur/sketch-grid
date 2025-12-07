/*
  Warnings:

  - You are about to drop the `Geometry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Geometry" DROP CONSTRAINT "Geometry_room_id_fkey";

-- DropTable
DROP TABLE "public"."Geometry";

-- CreateTable
CREATE TABLE "Shape" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
