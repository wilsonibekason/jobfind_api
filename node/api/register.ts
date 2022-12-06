import express from "express";
import { handleNewUser } from "../controller/registrationController";
const router = express.Router();

router.post("/", handleNewUser);

export { router };
