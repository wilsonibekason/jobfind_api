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

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password is invalid" });

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser)
    return res.status(401).sendStatus(401).json({ message: "NO USER FOUND " });

  const match = await bcrypt.compare(pwd, foundUser.username);
  if (match) {
    //
    const accesToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.ACCESSS_TOKEN_SECRET,
      {
        expiresIn: "100s",
      }
    );
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const otherUser = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUser, currentUser]);
    await promises.writeFile(
      path.join(__dirname, "..", "model", "user.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: `Username is logged in ${accesToken}`,
    });
  } else {
    res.sendStatus(401);
  }
};

export { handleLogin };
