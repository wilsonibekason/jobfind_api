import EventEmitter from "events";
import path from "path";
import uuid from "uuid";
import express from "express";
const router = express.Router();

router.get("^/$|/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});

export { router };
