import express from "express";
import { handleRefreshToken } from "../controller/refreshController";
const router = express.Router();

router.get("/", handleRefreshToken);

export { router };
