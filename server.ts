import { config } from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
config();
const PORT = process.env.ENV || 8000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "public", "html/index.html"));

  res.send("Hello world");

  console.log(process.env.NODE_ENV);

  res.end();
});

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
