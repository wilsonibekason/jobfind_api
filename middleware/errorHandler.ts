import { logEvents } from "./logEvents";

interface ErrOption {
  name: string;
  message: string;
  stack: string;
}
const errorHandler = (err: ErrOption, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, `errLog.txr`);
  console.log(err.stack);
  res.status(500).send(err.message);
};

export { errorHandler };
