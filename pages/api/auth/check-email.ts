// pages/api/auth/check-email.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    res.status(200).json({ exists: Boolean(existingUser) });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
