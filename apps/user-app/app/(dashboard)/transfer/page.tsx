import prisma from "@repo/prisma/client";
import { getServerSession } from "next-auth";

import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { authOptions } from "../../../lib/auth";

async function getBalance() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      amount: 0,
      locked: 0,
    };
  }

  const balance = await prisma.balance.findUnique({
    where: {
      userId: Number(session.user.id),
    },
  });

  return {
    amount: balance?.amount ?? 0,
    locked: balance?.locked ?? 0,
  };
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session.user.id),
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return txns.map((txn) => ({
    time: txn.startTime,
    amount: txn.amount,
    status: txn.status,
    provider: txn.provider,
  }));
}

export default async function () {
  const [balance, transactions] = await Promise.all([
    getBalance(),
    getOnRampTransactions(),
  ]);

  return (
    <div className="w-full px-6 py-8">
      <h1 className="mb-8 text-4xl font-bold text-[#6a51a6]">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AddMoney />

        <div className="space-y-6">
          <BalanceCard
            amount={balance.amount}
            locked={balance.locked}
          />

          <OnRampTransactions
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
}