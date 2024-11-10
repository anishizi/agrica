// pages/api/expenses/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { description, unitPrice, quantity, projectId } = req.body;
    const total = unitPrice * quantity;

    try {
      const newExpense = await prisma.expense.create({
        data: {
          description,
          unitPrice,
          quantity,
          total,
          project: { connect: { id: projectId } },
        },
      });
      res.status(201).json(newExpense);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la dépense." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
