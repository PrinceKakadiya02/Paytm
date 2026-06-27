import { Card } from "@repo/ui/card";

type BalanceCardProps = {
  amount?: number;
  locked?: number;
};

export const BalanceCard = ({
  amount = 0,
  locked = 0,
}: BalanceCardProps) => {
  const unlockedBalance = amount / 100;
  const lockedBalance = locked / 100;
  const totalBalance = (amount + locked) / 100;

  return (
    <Card title="Balance">
      <div className="flex justify-between border-b border-slate-300 pb-2">
        <span>Unlocked Balance</span>
        <span>{unlockedBalance.toFixed(2)} INR</span>
      </div>

      <div className="flex justify-between border-b border-slate-300 py-2">
        <span>Locked Balance</span>
        <span>{lockedBalance.toFixed(2)} INR</span>
      </div>

      <div className="flex justify-between py-2 font-medium">
        <span>Total Balance</span>
        <span>{totalBalance.toFixed(2)} INR</span>
      </div>
    </Card>
  );
};