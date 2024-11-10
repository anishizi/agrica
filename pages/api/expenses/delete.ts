// pages/api/expenses/delete.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        res.status(400).json({ error: "Invalid expense ID" });
        return;
    }

    const expenseId = parseInt(id as string);

    try {
        await prisma.expense.delete({ where: { id: expenseId } });
        res.status(204).end(); // Ends the response without returning data
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Error deleting expense" });
    }
}
