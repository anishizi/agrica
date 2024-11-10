// pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, date, description, projectId } = req.body;

    try {
      const newTask = await prisma.task.create({
        data: {
          name,
          date: new Date(date),
          description,
          isCompleted: false,
          project: {
            connect: { id: projectId },
          },
        },
      });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de la tâche." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
