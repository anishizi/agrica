// pages/api/credits/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  // Vérifiez que l'ID de l'utilisateur est présent dans la requête
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Requête pour récupérer les crédits
    const credits = await prisma.credit.findMany({
      where: {
        participants: {
          some: { id: Number(userId) }, // Vérifiez que l'utilisateur connecté est un participant
        },
      },
      select: {
        id: true,
        amount: true,
        monthsToRepay: true,
        monthlyPayment: true,
        startDate: true,
        createdAt: true,
        participants: {
          select: {
            id: true,
            name: true, // Incluez le nom du participant pour affichage
          },
        },
      },
    });

    // Si aucun crédit n'est trouvé, renvoyez une réponse vide
    if (credits.length === 0) {
      return res.status(200).json([]); // Renvoie un tableau vide si aucun crédit n'est trouvé
    }

    res.status(200).json(credits); // Renvoie les crédits trouvés
  } catch (error) {
    console.error("Error fetching credits for user:", error);
    res.status(500).json({ message: "Failed to fetch credits" });
  }
}
