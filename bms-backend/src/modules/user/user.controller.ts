import { NextFunction, Request, Response } from "express";
import * as UserService from "./user.service";
import { UserModel } from "./user.model";

// Extend Express Request
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

/* ---------------- CREATE USER ---------------- */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/* ---------------- GET USER BY ID ---------------- */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getUserById(req.params.id);

    if (!user) {
     res.status(404).json({ success: false, message: "User not found" });
     return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/* ---------------- ACTIVATE USER ---------------- */
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { activateUser: true },
      { new: true }
    );

    if (!updatedUser) {
       res.status(404).json({ success: false, message: "User not found" });
       return;
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

/* ---------------- UPDATE PROFILE (LOGGED USER) ---------------- */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id; // ✅ consistent

    if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
       res.status(404).json({ success: false, message: "User not found" });
       return;
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

/* ---------------- GET PROFILE ---------------- */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id; // ✅ FIXED (was req.user?.id)

    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return;
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
     res.status(404).json({ success: false, message: "User not found" });
     return;
    }

    if (!user.activateUser) {
       res.status(403).json({ message: "User not activated" });
       return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};