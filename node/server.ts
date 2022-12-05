import EventEmitter from "events";

import http from "http";
import path from "path";
import fs from "fs";
import { config } from "dotenv";
import { equal } from "assert";
import { da } from "date-fns/locale";

config();

const PORT = process.env.PORT || 4000;

const serveFile = async (fllePath, contentType: string, response) => {
  try {
    const rawData = await fsPromises.readFile(
      fllePath,
      !contentType.includes("image") ? "utf8" : "ascii"
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(fllePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (error) {
    console.log(error);
    response.statuCode = 500;
    response.end();
  }
};

const fsPromises = fs.promises;

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  let filePath: string;
  if (req.url === "/" || req.url === "index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    filePath = path.join(__dirname, "files", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  }
});

const server2 = http.createServer((req, res) => {
  const extension = path.extname(req.url as string);

  let contentType: string = "";

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url?.slice(-1) === "/"
      ? path.join(__dirname, "files", "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url as string)
      : path.join(__dirname, req.url as string, "index.html");

  if (!extension && req.url?.slice(-1) !== "/") filePath += ".html";

  const fileExisits = fs.existsSync(filePath);

  if (fileExisits) {
    serveFile(filePath, contentType, res);
    // seve file
  } else {
    switch (path.parse(filePath).name) {
      case "old-page-html":
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "ww-page.html":
        res.writeHead(301, { location: "/" });
        res.end();
        break;
      default:
        serveFile(
          path.join(__dirname, "views", "index.html"),
          "text/html",
          res
        );
    }
    // 404
    //301 redirect
    console.log(path.parse(filePath));
  }
});

server.listen(PORT, () => console.log("Server is running on port "));
