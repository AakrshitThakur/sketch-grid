// apps/* — include every directory directly under apps/ as a workspace.
import express from "express";
import dotenv from "dotenv";
import auth_router from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// parsing body object
app.use(express.json());

app.use("/api/v1/auth", auth_router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.info("Server successfully running on port", port);
});
