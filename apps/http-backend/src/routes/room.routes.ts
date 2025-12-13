import express from "express";
import { check_user_auth } from "../middlewares/auth.middlewares.js";
import {
  create_room_controller,
  join_room_controller,
  get_room_by_id_controller,
  get_all_rooms_controller,
  get_all_admin_rooms_controller,
  delete_room_controller,
} from "../controllers/room.controllers.js";

const router = express.Router();

router.post("/create", check_user_auth, create_room_controller);
router.post("/join", check_user_auth, join_room_controller);
router.get("/all", get_all_rooms_controller);
router.get("/mine", check_user_auth, get_all_admin_rooms_controller);
router.get("/:room_id", check_user_auth, get_room_by_id_controller);
router.delete("/:room_id/delete", check_user_auth, delete_room_controller);

export default router;
