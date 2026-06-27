"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";

import { p2pTransfer } from "../lib/actions/p2ptransfer";

export const SendCard = () => {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-[70vh]">
      <Center>
        <Card title="Send Money">
          <div className="min-w-72 pt-2">
            <TextInput
              label="Phone Number"
              placeholder="Phone Number"
              value={number}
              onChange={setNumber}
              disabled={loading}
            />

            <TextInput
              label="Amount"
              placeholder="Amount"
              value={amount}
              onChange={setAmount}
              type="number"
              disabled={loading}
            />

            <div className="pt-4 flex justify-center">
              <Button
                disabled={
                  loading ||
                  !number.trim() ||
                  Number(amount) <= 0
                }
                onClick={async () => {
                  setLoading(true);

                  const response = await p2pTransfer(
                    number,
                    Number(amount) * 100
                  );

                  setLoading(false);

                  alert(response.message);

                  if (response.success) {
                    setAmount("");
                    setNumber("");

                    router.refresh();
                  }
                }}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
};