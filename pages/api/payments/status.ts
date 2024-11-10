import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { creditId, month, year } = req.query;

    // Ensure month and year are defined
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    try {
      const paymentStatuses = await prisma.payment.findMany({
        where: {
          creditId: Number(creditId),
          month: Number(month), // Filter by month
          year: Number(year)    // Filter by year
        },
        include: { user: { select: { id: true, name: true } } } // Include user details
      });

      // If no records are found, return a default response indicating unpaid status
      if (paymentStatuses.length === 0) {
        return res.status(200).json([]); // No payments recorded
      }

      res.status(200).json(paymentStatuses);
    } catch (error) {
      console.error("Failed to fetch payment statuses:", error);
      res.status(500).json({ message: "Failed to fetch payment statuses" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
