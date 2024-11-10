// pages/api/projects/edit.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { id, name, estimatedCost, startDate, endDate, description } = req.body;
    if (!id) return res.status(400).json({ message: "Invalid project ID" });

    await prisma.project.update({
      where: { id },
      data: { name, estimatedCost, startDate: new Date(startDate), endDate: new Date(endDate), description },
    });
    res.status(200).json({ message: "Project updated successfully" });
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
