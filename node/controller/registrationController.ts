import data from "../model/users.json";
import { promises } from "fs";
import path from "path";
import bcrypt from "bcrypt";
export type TUser = {
  username: string;
  pwd: string;
  token: string;
  refreshToken: string;
  roles: <S>{Admin?: S,
    Editor?: S,
    User?: S};
};
export interface TUsers {
  users: TUser[];
  setUsers: (data: TUser) => void;
}
const usersDB: TUsers = {
  users: data,
  setUsers: function (data: TUser) {
    this.users = data;
  },
};

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password is invalid" });

  const duplicateUser = usersDB.users.find(
    (person) => person.username === user
  );
  if (duplicateUser) return res.sendStatus(409); //conflict

  try {
    //encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the user
    const newUser = {
      Username: user,
      roles: { User: 2001 },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await promises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({ success: `new user ${user} created` });
  } catch (err) {
    res.status(500).json({ message: `${err instanceof Error && err.message}` });
  }
};

export { handleNewUser };
