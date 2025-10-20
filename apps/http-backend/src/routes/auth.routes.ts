import express from "express";
import {
  signin_controller,
  signup_controller,
  signout_controller,
  is_user_authenticated_controller,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signin", signin_controller);
router.post("/signup", signup_controller);
router.delete("/signout", signout_controller);
router.get("/check-authentication", is_user_authenticated_controller);

export default router;
