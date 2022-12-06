import express from "express";
import { handleLogin } from "../controller/authController";
const router = express.Router();

router.post("/", handleLogin);

export { router };
