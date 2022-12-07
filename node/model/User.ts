import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);

export { User };
