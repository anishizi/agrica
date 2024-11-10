import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { expenseId } = req.query;

  if (req.method === "PATCH") {
    const { description, unitPrice, quantity } = req.body;
    try {
      const updatedExpense = await prisma.expense.update({
        where: { id: Number(expenseId) },
        data: {
          description,
          unitPrice,
          quantity,
          total: unitPrice * quantity,
        },
      });
      res.status(200).json(updatedExpense);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la dépense." });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
