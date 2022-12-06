import jwt from "jsonwebtoken";
import { config } from "dotenv";

export interface SignOptions {
  /**
   * Signature algorithm. Could be one of these values :
   * - HS256:    HMAC using SHA-256 hash algorithm (default)
   * - HS384:    HMAC using SHA-384 hash algorithm
   * - HS512:    HMAC using SHA-512 hash algorithm
   * - RS256:    RSASSA using SHA-256 hash algorithm
   * - RS384:    RSASSA using SHA-384 hash algorithm
   * - RS512:    RSASSA using SHA-512 hash algorithm
   * - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
   * - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
   * - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
   * - none:     No digital signature or MAC value included
   */
  algorithm?: Algorithm | undefined;
  keyid?: string | undefined;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: string | number | undefined;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  notBefore?: string | number | undefined;
  audience?: string | string[] | undefined;
  subject?: string | undefined;
  issuer?: string | undefined;
  jwtid?: string | undefined;
  mutatePayload?: boolean | undefined;
  noTimestamp?: boolean | undefined;
  header?: boolean | undefined;
  encoding?: string | undefined;
}

config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorisation"] || req.headers?.Authorisation;
  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);
  console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded: { username: string; UserInfo?: { user: string } }) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = decoded?.username;
      req.roles = decoded.UserInfo?.user;
      next();
    }
  );
};

export { verifyJWT };
