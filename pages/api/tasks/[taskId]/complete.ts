// pages/api/tasks/[taskId]/complete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (req.method === "PATCH") {
    try {
      const updatedTask = await prisma.task.update({
        where: { id: Number(taskId) },
        data: { isCompleted: true },
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche." });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
