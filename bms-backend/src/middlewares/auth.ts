import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";

export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    console.log("Authorization Header:", authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return;
    }

    console.log("config.accessTokenSecret:", config.accessTokenSecret);

    const decoded = jwt.verify(token, config.accessTokenSecret as string);

    console.log("DECODED:", decoded);

    // attach user to request
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