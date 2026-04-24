import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Sem autorização" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Usuário sem autorização" });
    }
    next();
  };
};
