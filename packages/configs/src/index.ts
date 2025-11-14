import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const JWT_SECRET = process.env.JWT_SECRET || "";
const ENVIRONMENT = process.env.ENVIRONMENT || "";

export { JWT_SECRET, ENVIRONMENT };
