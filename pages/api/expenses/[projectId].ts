// pages/api/expenses/[projectId].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (req.method === "GET") {
    try {
      const expenses = await prisma.expense.findMany({
        where: { projectId: Number(projectId) },
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des dépenses." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
