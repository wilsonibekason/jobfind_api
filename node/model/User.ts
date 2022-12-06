import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: {
    type: String,
    requied: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
});
