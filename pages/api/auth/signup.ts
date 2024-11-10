// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
