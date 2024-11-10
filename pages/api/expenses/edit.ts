// pages/api/expenses/edit.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, description, unitPrice, quantity } = req.body;
    if (!id || !description || !unitPrice || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const expenseId = parseInt(id as string);

    try {
        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                description,
                unitPrice: parseFloat(unitPrice),
                quantity: parseInt(quantity),
                total: parseFloat(unitPrice) * parseInt(quantity),
            },
        });

        return res.status(200).json(updatedExpense); // Return updated object for confirmation
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({ error: "Error updating expense" });
    }
}
