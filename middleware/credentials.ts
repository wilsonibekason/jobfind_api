import allowedOrigins from "../config/allowOrigins";
const credientials = (req, res, next) => {
  const origin = req?.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credientials", true);
  }
  next();
};

export default credientials;
