// pages/api/projects.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const projects = await prisma.project.findMany();
    
    // Fetch expenses for each project and calculate totals
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const expenses = await prisma.expense.findMany({
          where: { projectId: project.id },
        });
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.total, 0);
        
        const progress = calculateProgress(project.startDate, project.endDate);
        const isOverdue = new Date() > new Date(project.endDate);
        
        return { 
          ...project, 
          progress, 
          isOverdue, 
          totalExpenses // Add total expenses to project data
        };
      })
    );

    res.status(200).json(enrichedProjects);
  } else if (req.method === "POST") {
    const { name, estimatedCost, startDate, endDate, description } = req.body;
    await prisma.project.create({
      data: { name, estimatedCost, startDate: new Date(startDate), endDate: new Date(endDate), description },
    });
    res.status(201).json({ message: "Projet ajouté avec succès" });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}

// Modify calculateProgress to accept Date types
function calculateProgress(startDate: Date, endDate: Date): number {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const today = new Date().getTime();
  if (today >= end) return 100;
  if (today <= start) return 0;
  return ((today - start) / (end - start)) * 100;
}
