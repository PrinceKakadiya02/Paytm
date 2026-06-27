"use server";

import { getServerSession } from "next-auth";
import prisma from "@repo/prisma/client";

import { authOptions } from "../auth";

export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthenticated request",
      };
    }

    const token = crypto.randomUUID();

    await prisma.onRampTransaction.create({
      data: {
        userId: Number(session.user.id),
        amount,
        status: "Processing",
        provider,
        startTime: new Date(),
        token,
      },
    });

    return {
      success: true,
      message: "Transaction initiated successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to initiate transaction.",
    };
  }
}