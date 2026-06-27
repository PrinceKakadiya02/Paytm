"use server";

import { getServerSession } from "next-auth";

import prisma from "@repo/prisma/client";

import { authOptions } from "../auth";

export async function p2pTransfer(
  to: string,
  amount: number
) {
  const session = await getServerSession(authOptions);

  const from = session?.user?.id;

  if (!from) {
    return {
      success: false,
      message: "Please login again.",
    };
  }

  if (amount <= 0) {
    return {
      success: false,
      message: "Invalid amount.",
    };
  }

  const toUser = await prisma.user.findUnique({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  if (Number(from) === toUser.id) {
    return {
      success: false,
      message: "You cannot transfer money to yourself.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT *
        FROM "Balance"
        WHERE "userId" = ${Number(from)}
        FOR UPDATE
      `;

      const fromBalance = await tx.balance.findUnique({
        where: {
          userId: Number(from),
        },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient balance.");
      }

      const receiverBalance = await tx.balance.findUnique({
        where: {
          userId: toUser.id,
        },
      });

      if (!receiverBalance) {
        throw new Error("Receiver balance not found.");
      }

      await tx.balance.update({
        where: {
          userId: Number(from),
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      await tx.balance.update({
        where: {
          userId: toUser.id,
        },
        data: {
          amount: {
            increment: amount,
          },
        },
      });

      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount,
          timestamp: new Date(),
        },
      });
    });

    return {
      success: true,
      message: "Money sent successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Transaction failed.",
    };
  }
}