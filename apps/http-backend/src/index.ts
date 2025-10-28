// apps/* — include every directory directly under apps/ as a workspace.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auth_router from "./routes/auth.routes.js";
import room_router from "./routes/room.routes.js";
import { CORS_OPTIONS } from "./configs/constants.js";

dotenv.config();

const app = express();

// cross-origin requests
app.use(cors(CORS_OPTIONS));

// parsing body object
app.use(express.json());

app.use("/api/v1/auth", auth_router);
app.use("/api/v1/rooms", room_router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.info("Server successfully running on port", port);
});
