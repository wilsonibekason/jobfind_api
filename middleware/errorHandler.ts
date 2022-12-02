import { logEvents } from "./logEvents";

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.mame}: ${err.message}`, `errLog.txr`);
  console.log(err.stack);
  res.status(500).send(err.message);
};

export { errorHandler };
