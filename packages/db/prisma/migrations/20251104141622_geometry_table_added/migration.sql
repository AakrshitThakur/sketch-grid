-- CreateEnum
CREATE TYPE "Type" AS ENUM ('BOX', 'CIRCLE');

-- CreateTable
CREATE TABLE "Geometry" (
    "id" SERIAL NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'BOX',
    "room_id" INTEGER NOT NULL,
    "admin_id" TEXT NOT NULL,

    CONSTRAINT "Geometry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Geometry" ADD CONSTRAINT "Geometry_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Geometry" ADD CONSTRAINT "Geometry_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
