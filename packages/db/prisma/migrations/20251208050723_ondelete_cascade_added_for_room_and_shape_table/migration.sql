-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shape" DROP CONSTRAINT "Shape_room_id_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
