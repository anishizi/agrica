import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ error: "Erreur de configuration du serveur." });
    }

    const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);

    // Ensure ipAddress is a string
    let ipAddress = req.headers["x-forwarded-for"];
    if (Array.isArray(ipAddress)) {
      ipAddress = ipAddress[0]; // Take the first IP if it's an array
    } else {
      ipAddress = ipAddress || req.socket.remoteAddress || "Inconnu";
    }

    if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
      ipAddress = "IP Locale";
    }

    const userAgent = req.headers["user-agent"] || "Appareil inconnu";
    const simplifiedUserAgent = simplifyUserAgent(userAgent);

    await prisma.connectionHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        device: simplifiedUserAgent,
        loggedInAt: new Date(),
      },
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erreur inattendue dans le gestionnaire de connexion:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

function simplifyUserAgent(userAgent: string): string {
  if (userAgent.includes("Mobile")) return "Mobile";
  if (userAgent.includes("Windows")) return "PC - Windows";
  if (userAgent.includes("Mac")) return "PC - Mac";
  if (userAgent.includes("Linux")) return "PC - Linux";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "Mobile - iOS";
  if (userAgent.includes("Android")) return "Mobile - Android";
  if (userAgent.includes("Chrome")) return "Chrome Browser";
  if (userAgent.includes("Firefox")) return "Firefox Browser";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari Browser";
  return "Appareil inconnu";
}
