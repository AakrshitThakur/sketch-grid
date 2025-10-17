import express from "express";
import {
  signin_controller,
  signup_controller,
  signout_controller,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signin", signin_controller);
router.post("/signup", signup_controller);
router.delete("/signout", signout_controller);

export default router;
