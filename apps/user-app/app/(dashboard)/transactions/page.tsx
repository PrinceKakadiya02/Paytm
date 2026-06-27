import prisma from "@repo/prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";

import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { OnP2PTransactions } from "../../../components/OnP2PTransactions";

async function getTransactions() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      onRampTransactions: [],
      p2pTransactions: [],
    };
  }

  const userId = Number(session.user.id);

  const [onRampTransactions, p2pTransactions] =
    await Promise.all([
      prisma.onRampTransaction.findMany({
        where: {
          userId,
        },
        orderBy: {
          startTime: "desc",
        },
      }),

      prisma.p2pTransfer.findMany({
        where: {
          fromUserId: userId,
        },
        orderBy: {
          timestamp: "desc",
        },
        select: {
          amount: true,
          timestamp: true,
          toUser: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

  return {
    onRampTransactions: onRampTransactions.map((t) => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider,
    })),

    p2pTransactions: p2pTransactions.map((t) => ({
      name: t.toUser.name,
      amount: t.amount,
      timestamp: t.timestamp,
    })),
  };
}

export default async function TransactionsPage() {
  const data = await getTransactions();

  return (
    <div className="w-full px-6 py-8">
      <h1 className="mb-8 text-4xl font-bold text-[#6a51a6]">
        Transactions
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OnRampTransactions
          transactions={data.onRampTransactions}
        />

        <OnP2PTransactions
          transactions={data.p2pTransactions}
        />
      </div>
    </div>
  );
}