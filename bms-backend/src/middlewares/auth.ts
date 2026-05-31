import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    

    const token =
      req.cookies?.accessToken;
console.log("Cookies:", token);
    if (!token) {
       res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return;
    }
    console.log("config.accessTokenSecret:", config.accessTokenSecret);
console.log("process.env.JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, config.accessTokenSecret);
    console.log("DECODED:", decoded);
    

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error);
     res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
    return;
  }
};