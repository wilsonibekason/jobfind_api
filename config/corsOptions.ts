import allowedOrigins from "./allowOrigins";

const corsOptions = {
  origin: (origin, callback: <N, B>(a?: N, b?: B) => void) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback<null, boolean>(null, true);
    } else {
      callback(new Error("Not Allowed by CORS_OPTIONS"));
    }
  },
  optionSuccessStatus: 200,
};

export { corsOptions };
