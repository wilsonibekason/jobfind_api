import express, { Express } from "express";
import path from "path";
import { config } from "dotenv";
import cors from "cors";
import { logEvents, logger } from "../middleware/logEvents";
import { errorHandler } from "../middleware/errorHandler";

const app = express();

const PORT = process.env.PORT || 5000;

config();

app.get("^$|/index(.html)?", (req, res) => {
  res.sendFile("./view/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use(express.urlencoded({ extended: false, limit: "", parameterLimit: 1 }));

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

const corsOptions = {
  origin: (origin, callback: <N, B>(N?, B?) => void) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback<null, boolean>(null, true);
    } else {
      callback(new Error("Not Alloe"));
    }
  },
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// serve static paths
app.use(express.static(path.join(__dirname, "./public")));

// routes
app.use("/", require("./root"));

app.use("./subdir", express.static(path.join(__dirname, "./public")));

app.use("/subdir", require("./subdir"));

app.use("/employees", require("./routes/api/employees"));

app.use("/register", require("./routes/register"));

app.use("/auth", require("./config/auth"));

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
app.listen(PORT, () => console.log(`port runung n port ${PORT}`));
