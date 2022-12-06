import data from "../model/users.json";
import { promises } from "fs";
import path from "path";
import bcrypt from "bcrypt";
type TUser = {
  username: string;
  pwd: string;
  token: string;
};
interface TUsers {
  users: TUser[];
}
const usersDB: TUsers = {
  users: data,
  setUsers: function (data) {
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
    const newUser = { Username: user, password: hashedPwd };
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
