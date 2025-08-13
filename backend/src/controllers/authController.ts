import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateToken = (id: string, roles: string[]) => {
  return jwt.sign(
    { id, roles },
    process.env.JWT_SECRET || "your_default_secret",
    {
      expiresIn: "10s",
    }
  );
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body; // 'identifier' có thể là username hoặc email
  try {
    // Tìm kiếm user bằng cả email hoặc username, và yêu cầu trả về cả password
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (user && (await user.comparePassword(password))) {
      // Đăng nhập thành công, không trả về password
      const userObject = user.toObject();
      delete userObject.password;

      res.json({
        ...userObject,
        token: generateToken(
          (user._id as Types.ObjectId).toString(),
          user.roles
        ),
      });
    } else {
      res.status(401).json({ message: "Invalid identifier or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
