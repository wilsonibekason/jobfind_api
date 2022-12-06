import express from "express";
import { handleLogout } from "../controller/logoutController";
const router = express.Router();

router.get("/", handleLogout);

export { router };
