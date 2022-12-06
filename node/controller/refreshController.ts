import data from "../model/users.json";
import { promises } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { TUsers, TUser } from "./registrationController";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
const usersDB: TUsers = {
  users: data,
  setUsers: function (data: TUser) {
    this.users = data;
  },
};

config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  const { user, pwd } = req.body;

  if (!cookies?.jwt) return res.status(401);
  console.log(cookies?.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser)
    return res.status(401).sendStatus(403).json({ message: "NO USER FOUND " }); // Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.status(401).sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "100s" }
    );
    res.cookie("jwt", accessToken, { httpOnly: true });
    res.status(201).json({ accessToken });
  });
};

export { handleRefreshToken };
