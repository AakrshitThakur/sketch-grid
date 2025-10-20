import express from "express";
import { create_room_controller } from "../controllers/room.controllers.js";
import { check_user_auth } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create-room", check_user_auth, create_room_controller);

export default router;
