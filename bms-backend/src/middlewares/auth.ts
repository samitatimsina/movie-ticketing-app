import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers.authorization);

    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
       res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return;
    }

    const decoded = jwt.verify(token, config.accessTokenSecret);

    req.user = decoded;

    next();
  } catch (error) {
     res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
    return;
  }
};