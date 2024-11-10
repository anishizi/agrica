// pages/api/projects-with-tasks.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        include: {
          tasks: true,
        },
      });
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des projets avec tâches." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
