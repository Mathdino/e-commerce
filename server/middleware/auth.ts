import { Request, Response, NextFunction } from "express";
import { clerkClient } from "@clerk/express";
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
      /* Usuário autenticado no Clerk mas sem registro no MongoDB
         (webhook pode ter falhado ou e-mail já existe sem clerkId).
         findOneAndUpdate com upsert é atômico e evita E11000. */
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
      const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Usuário";
      const role = (clerkUser.publicMetadata?.role as string) ?? "user";

      user = await User.findOneAndUpdate(
        { $or: [{ clerkId: userId }, { email }] },
        { $set: { clerkId: userId, name, email, role } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
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
