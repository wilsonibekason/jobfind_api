import data from "../model/users.json";
import { promises } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { TUsers, TUser } from "./registrationController";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { User } from "../model/User";
import { decode } from "punycode";
const usersDB: TUsers = {
  users: data,
  setUsers: function (data: TUser) {
    this.users = data;
  },
};

config();

const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Refresh token not present" });

    const refreshToken = cookies.jwt;

    const decoded: { email: string } = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log(`Email is coming from ${decoded.email}`);

    if (!decoded || !decoded.email)
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid Refresh Token" });

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser)
      return res
        .status(401)
        .json({ status: "error", message: "No user was found" });

    const payload = {
      id: foundUser.id,
      username: foundUser.username,
    };

    const access_token = await jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30sec" /** process.env.ACCESS_TOKEN_SECRET_TTL*/ }
    );

    return res
      .status(201)
      .json({ message: "Refreshed SuccessFullly", access_token });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }
};

export { refreshToken };
