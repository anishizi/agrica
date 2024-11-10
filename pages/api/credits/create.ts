// pages/api/credits/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { amount, monthsToRepay, startDate, participantsIds } = req.body;

    // Validate required fields
    if (!amount || !monthsToRepay || !startDate || !participantsIds?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Create credit
      const credit = await prisma.credit.create({
        data: {
          amount,
          monthsToRepay,
          startDate: new Date(startDate),
          monthlyPayment: amount / monthsToRepay,
          participants: {
            connect: participantsIds.map((id: number) => ({ id })), // Specify 'id' as a number
          },
        },
      });

      // Create payment records for each month
      const paymentRecords = [];
      const startMonth = new Date(startDate).getMonth() + 1; // Months are 0-indexed
      const startYear = new Date(startDate).getFullYear();

      for (let i = 0; i < monthsToRepay; i++) {
        const month = (startMonth + i - 1) % 12 + 1; // Calculate month
        const year = startYear + Math.floor((startMonth + i - 1) / 12); // Calculate year

        paymentRecords.push({
          creditId: credit.id,
          userId: participantsIds[i % participantsIds.length], // Assign participants cyclically
          month,
          year,
          confirmed: false,
        });
      }

      // Insert payment records
      await prisma.payment.createMany({
        data: paymentRecords,
      });

      // Send success response
      res.status(201).json({ credit });
    } catch (error) {
      console.error("Error creating credit:", error);
      res.status(500).json({ message: "Failed to create credit" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
