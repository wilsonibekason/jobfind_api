import data from "../model/users.json";
import { promises } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { TUsers, TUser } from "./registrationController";
const usersDB: TUsers = {
  users: data,
  setUsers: function (data: TUser) {
    this.users = data;
  },
};

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
    res.json({
      message: "Username is logged in",
    });
  } else {
    res.sendStatus(401);
  }
};

export { handleLogin };
