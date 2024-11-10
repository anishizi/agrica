// pages/api/connection-history.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }

  try {
    const history = await prisma.connectionHistory.findMany({
      select: {
        id: true,
        loggedInAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        loggedInAt: "desc",
      },
    });

    const formattedHistory = history.map((entry) => ({
      id: entry.id,
      name: entry.user?.name || "Nom non disponible",
      loggedInAt: entry.loggedInAt,
    }));

    return res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des connexions:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
