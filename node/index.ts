import EventEmitter from "events";
import fs from "fs";
import path from "path";
import { logEvents } from "../middleware/logEvents";

const controller = new AbortController();
const fsPromises = fs.promises;

const signal = controller.signal;
fs.readFile("", { signal }, (err, buf) => {
  // ...
});

fs.readFile(
  path.join(__dirname, "files", ""),
  "utf8",
  (err: unknown | any, data) => {
    err instanceof Error && err.message;
    console.log(data);
  }
);

process.on("uncaughtException", (err) => {
  console.log(`There wa an uncaught error: ${err}`);
  process.exit(1);
});

const data = new Uint8Array(Buffer.from("Hello Node.js"));
fs.writeFile(path.join(__dirname, "files", "reply.txt"), data, (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
  fs.appendFile("message.txt", "data to append", "utf8", (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
    fs.rename(path.join(__dirname, "files"), "newFile.txt", (err) => {
      if (err) throw err;
      console.log("Rename complete!");
    });
  });
});

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname), "utf8");
    console.log(data);
    await fsPromises.unlink(path.join(__dirname));
    await fsPromises.writeFile(path.join(__dirname, "files", "tet.tsx"), data);
    await fsPromises.appendFile(
      path.join(__dirname, "files", "tet.tsx"),
      "\n\nnice tomet"
    );
    await fsPromises.rename(
      path.join(__dirname, "files", "tet.tsx"),
      path.join(__dirname, "files", "text.tsx")
    );
  } catch (error) {}
};

fileOps();

const rs = fs.createReadStream("file", { encoding: "utf-8" });

class MyEmitter extends EventEmitter {}
//initialie objects
const myEmitter = new MyEmitter();

myEmitter.on("foo", (msg) => logEvents(msg, "fkfk"));
myEmitter.prependListener("foo", () => console.log("b"));
myEmitter.emit("foo");

setTimeout(() => {
  myEmitter.emit("");
}, 2000);

myEmitter.on("event", function firstListener() {
  console.log("Helloooo! first listener");
});
// Second listener
myEmitter.on("event", function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on("event", function thirdListener(...args) {
  const parameters = args.join(", ");
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners("event"));

myEmitter.emit("event", 1, 2, 3, 4, 5);
