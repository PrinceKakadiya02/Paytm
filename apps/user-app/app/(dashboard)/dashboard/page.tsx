


import prisma from "@repo/prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "../../../lib/auth";

import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { OnP2PTransactions } from "../../../components/OnP2PTransactions";

async function getDashboardData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      balance: {
        amount: 0,
        locked: 0,
      },
      onRampTransactions: [],
      p2pTransactions: [],
    };
  }

  const userId = Number(session.user.id);

  const [balance, onRampTransactions, p2pTransactions] =
    await Promise.all([
      prisma.balance.findUnique({
        where: {
          userId,
        },
      }),

      prisma.onRampTransaction.findMany({
        where: {
          userId,
        },
        orderBy: {
          startTime: "desc",
        },
        take: 5,
      }),

      prisma.p2pTransfer.findMany({
        where: {
          fromUserId: userId,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: 5,
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
    balance: {
      amount: balance?.amount ?? 0,
      locked: balance?.locked ?? 0,
    },

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

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="w-full px-6 py-8">
      <h1 className="mb-8 text-4xl font-bold text-[#6a51a6]">
        Dashboard
      </h1>

      <div className="space-y-6">
        <BalanceCard
          amount={data.balance.amount}
          locked={data.balance.locked}
        />

        <OnRampTransactions
          transactions={data.onRampTransactions}
        />

        <OnP2PTransactions
          transactions={data.p2pTransactions}
        />

        <div className="flex flex-wrap gap-4">
          <Link
            href="/transfer"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Add Money
          </Link>

          <Link
            href="/p2p"
            className="rounded-lg bg-[#6a51a6] px-6 py-3 text-white hover:bg-[#5b4292]"
          >
            Send Money
          </Link>
        </div>
      </div>
    </div>
  );
}