import express from "express";
import {
  create_room_controller,
  get_room_by_id_controller,
  get_all_rooms_controller,
  delete_room_controller,
} from "../controllers/room.controllers.js";
import { check_user_auth } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create-room", check_user_auth, create_room_controller);
router.get("/all", get_all_rooms_controller);
router.get("/:room_id", check_user_auth, get_room_by_id_controller);
router.delete("/:room_id/delete", check_user_auth, delete_room_controller);

export default router;
