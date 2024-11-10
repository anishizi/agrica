// pages/api/tasks/[taskId]/supprime.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (req.method === "DELETE") {
    try {
      await prisma.task.delete({
        where: { id: Number(taskId) },
      });
      res.status(204).end(); // Succès sans contenu
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la tâche." });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
