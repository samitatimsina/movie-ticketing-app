import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: "Unauthorized: No token provided" 
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET || "your_secret_key"; // put a strong secret in .env
        const decoded = jwt.verify(token, secret) as {id:string};

        req.user = decoded; // attach user info to request
        next();
    } catch (error) {
     res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
     return;
    }
};