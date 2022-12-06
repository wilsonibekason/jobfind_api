const allowedOrigins = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5173/",
];

const corsOptions = {
  origin: (origin, callback: <N, B>(N?, B?) => void) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback<null, boolean>(null, true);
    } else {
      callback(new Error("Not Alloe"));
    }
  },
  optionSuccessStatus: 200,
};

export default allowedOrigins;
