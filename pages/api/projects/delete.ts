// pages/api/projects/delete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const projectId = parseInt(req.query.id as string);

    try {
      await prisma.expense.deleteMany({
        where: { projectId },
      });
      await prisma.task.deleteMany({
        where: { projectId },
      });
      await prisma.project.delete({
        where: { id: projectId },
      });
      res.status(200).json({ message: "Projet, tâches, et dépenses supprimés avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression du projet" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
