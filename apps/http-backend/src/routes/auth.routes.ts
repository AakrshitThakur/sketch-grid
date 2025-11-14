import express from "express";
import { check_user_auth } from "../middlewares/auth.middlewares.js";
import {
  signin_controller,
  signup_controller,
  signout_controller,
  is_user_authenticated_controller,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signin", signin_controller);
router.post("/signup", signup_controller);
router.delete("/signout", check_user_auth, signout_controller);
router.get("/is-user-authenticated", check_user_auth, is_user_authenticated_controller);

export default router;
