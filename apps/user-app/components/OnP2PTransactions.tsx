import { Card } from "@repo/ui/card";

type Transaction = {
  name: string | null;
  amount: number;
  timestamp: Date;
};

export const OnP2PTransactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <Card title="Transactions">
      {!transactions.length ? ( 
        <div className="flex h-40 items-center justify-center text-gray-500">
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2 transition hover:bg-gray-100"
            >
              <div>
                <p className="font-medium text-gray-800">
                  Sent to
                </p>

                <p className="text-sm font-semibold text-[#6a51a6]">
                  {transaction.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {transaction.timestamp.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-red-600">
                  - ₹{(transaction.amount / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};