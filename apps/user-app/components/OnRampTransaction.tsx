import { Card } from "@repo/ui/card";

type Transaction = {
  time: Date;
  amount: number;
  status: string;
  provider: string;
};

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="py-8 text-center text-slate-500">
          No recent transactions
        </div>
      </Card>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.time.getTime() - a.time.getTime()
  );

  return (
    <Card title="Recent Transactions">
      <div className="pt-2 space-y-4">
        {sortedTransactions.map((transaction) => {
          const title =
            transaction.status === "Success"
              ? "Received INR"
              : transaction.status === "Failure"
              ? "Failed INR"
              : "Processing INR";

          return (
            <div
              key={`${transaction.time.getTime()}-${transaction.provider}-${transaction.amount}`}
              className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-none"
            >
              <div>
                <div className="text-sm font-medium">
                  {title}
                </div>

                <div className="text-xs text-slate-500">
                  {transaction.provider}
                </div>

                <div className="text-xs text-slate-500">
                  {transaction.time.toLocaleString()}
                </div>
              </div>

              <div className="font-medium">
                + ₹{(transaction.amount / 100).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};