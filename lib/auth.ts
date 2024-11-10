import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Define the shape of the decoded JWT payload
interface DecodedToken {
  [key: string]: any;
}

// Extend the NextApiRequest type to include the `user` property
declare module "next" {
  export interface NextApiRequest {
    user?: DecodedToken;
  }
}

export const verifyToken = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requis" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded; // This should work now as we extended NextApiRequest
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};
