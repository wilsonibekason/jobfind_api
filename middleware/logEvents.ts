import { Headers } from "./../node_modules/@aws-sdk/types/dist-types/http.d";
import { format } from "date-fns";
import { v4 } from "uuid";

import fs from "fs";
import path from "path";
const uuid = v4();
const fsPromises = fs.promises;

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (error) {
    error instanceof Error && error.message;
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, `reqLog.txt`);
  console.log(`${req.methods} ${req.path} `);
  next();
};

export { logEvents, logger };
