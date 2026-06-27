import { getServerSession } from "next-auth";
import prisma from "@repo/prisma/client";

import { authOptions } from "../../../lib/auth";
import { SendCard } from "../../../components/SendCard";
import { OnP2PTransactions } from "../../../components/OnP2PTransactions";

type Transaction = {
  name: string;
  amount: number;
  timestamp: Date;
};

async function getP2PTransactions(): Promise<Transaction[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  try {
    const txns = await prisma.p2pTransfer.findMany({
      where: {
        fromUserId: Number(session.user.id),
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
    });

    return txns.map((txn) => ({
      name: txn.toUser.name ?? "Unknown User",
      amount: txn.amount,
      timestamp: txn.timestamp,
    }));
  } catch (error) {
    console.error("Failed to fetch P2P transactions:", error);
    return [];
  }
}

export default async function P2PTransferPage() {
  const transactions = await getP2PTransactions();

  return (
    <div className="w-full px-6 py-8">
      <h1 className="mb-8 text-4xl font-bold text-[#6a51a6]">
        Send Money
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SendCard />

        <OnP2PTransactions
          transactions={transactions}
        />
      </div>
    </div>
  );
}