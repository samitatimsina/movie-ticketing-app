import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../user/user.model";
import { config } from "../../config/config";

export const signupUser = async (payload: any) => {
  const { name, email, password } = payload;

  const existingUser = await UserModel.findOne({ email:payload.email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name:name,
    email:email,
    password: hashedPassword,
    role:"user",
    activateUser: true,
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.password) {
    throw new Error("Password login not enabled for this user");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.activateUser) {
    throw new Error("User not activated");
  }

  const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role,
  },
  config.accessTokenSecret,
  {
    expiresIn: "1d",
  }
);
console.log("SECRET:", config.accessTokenSecret);

  return {
    token,
    user,
  };
};