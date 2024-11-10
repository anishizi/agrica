// pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { name } = req.query; // Extract `name` query parameter

    try {
      if (name) {
        const normalizedName = (name as string).trim(); // Normalize name by trimming spaces

        // Use `findFirst` to look up the user by normalized name
        const user = await prisma.user.findFirst({
          where: { name: normalizedName },
          select: { id: true, name: true }, // Only fetch id and name fields
        });

        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        // Return all users if no name is specified
        const users = await prisma.user.findMany({
          select: { id: true, name: true }, // Only fetch id and name fields
        });
        res.status(200).json(users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
