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

const handleLogout = async (req, res) => {
  // on client also delete the accessToken
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(204); // Sucesfyul  no content to send
  console.log(cookies?.jwt);
  const refreshToken = cookies.jwt;

  // iS rEFRESHTOKEN  IN Db?
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser)
    res.clearCookie("jwt", { httpOnly: true }, { maxAge: 24 * 60 * 60 * 1000 });
  res.status(204).sendStatus(204).json({ message: "NO USER FOUND " }); // Forbidden

  // delete refresh token in db
  const otherUser = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUser, currentUser]);
  await promises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(usersDB.users, null)
  );
  res.clearCookie("jwt", { httpOnly: true }, { maxAge: 24 * 60 * 60 * 1000 }); //secure: true -- only serves on https
};

export { handleLogout };
