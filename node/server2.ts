import express, { Express } from "express";
import path from "path";
import { config } from "dotenv";
import cors from "cors";
import { logEvents, logger } from "../middleware/logEvents";
import { errorHandler } from "../middleware/errorHandler";
import { verifyJWT } from "../middleware/verifyJWT";
import cookieParser from "cookie-parser";
import { corsOptions } from "../config/corsOptions";
import credientials from "../middleware/credentials";
import mongoose from "mongoose";
import { connectDB } from "../config/dbConn";

const app = express();

const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

config();

app.get("^$|/index(.html)?", (req, res) => {
  res.sendFile("./view/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

/// middleware for formdata
app.use(express.urlencoded({ extended: false, limit: "", parameterLimit: 1 }));

// middleware for cookies
app.use(cookieParser());

// middleware for json objects
app.use(express.json());

/// cuetom middleware
app.use((req, res, next) => {
  logEvents(`${req.method}t${req.headers.origin}\t${req.url}`, "reqLog.text");
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(logger);

app.delete("");

const whiteList = [""];

// const corsOptions = {
//   origin: (origin, callback: <N, B>(arg0?: N, arg1?: B) => void) => {
//     if (whiteList.indexOf(origin) !== -1 || !origin) {
//       callback<null, boolean>(null, true);
//     } else {
//       callback(new Error("Not Alloe"));
//     }
//   },
//   optionSuccessStatus: 200,
// };

app.use(credientials);

/// MAKE SURE TO PASS THE CREDENTIALS BEFORE THR CORS_OPTIONS
app.use(cors(corsOptions));

// serve static paths
app.use(express.static(path.join(__dirname, "./public")));

// routes
app.use("/", require("./root"));

app.use("./subdir", express.static(path.join(__dirname, "./public")));

app.use("/subdir", require("./subdir"));

app.use("/register", require("./routes/register"));

app.use("/auth", require("./config/auth"));

app.use("/refreshToken", require("./config/refresh"));

app.use("/logout", require("./config/logout"));

/// jwt verified verifyJWT routes

app.use(verifyJWT);

app.use("/employees", require("./routes/api/employees"));

app.use(errorHandler);

app.get("/new-page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/new-page.html", (req, res) => {
  res.redirect(301, "/new-page.html");
});

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "files", "404.html"));
});

const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

app.get("/chsnin(.html)", [one, two]);

app.all("*", (REQ, RES) => {
  RES.status(404);
  if (REQ.accepts("htnl")) {
    RES.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (REQ.accepts("json")) {
    RES.json({ error: "" });
  } else {
    RES.type("text").send("fjffjf");
  }
});

app.get(
  "/new-page.html",
  (req, res, next) => {
    console.log("");
    next();
  },
  (req, res) => {
    res.send("Hello");
  }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`port runung n port ${PORT}`));
});
