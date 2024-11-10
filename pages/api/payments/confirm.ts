import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { creditId, userId, month, year } = req.body;

    try {
      // Update or create payment confirmation
      const payment = await prisma.payment.upsert({
        where: {
          userId_creditId_month_year: {
            userId,
            creditId,
            month,
            year,
          },
        },
        update: {
          confirmed: true,
        },
        create: {
          userId,
          creditId,
          month,
          year,
          confirmed: true,
        },
      });

      // Send success response
      res.status(200).json({ payment });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
