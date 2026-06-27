"use client";

import { useState } from "react";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/textinput";

import { createOnRampTransaction } from "../lib/actions/createOnRampTransaction";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
] ;

export const AddMoney = () => {
  const [amount, setAmount] = useState(0);

  const [provider, setProvider] = useState<string>(
    SUPPORTED_BANKS[0]?.name ?? ""
  );

  const [redirectUrl, setRedirectUrl] = useState<string>(
    SUPPORTED_BANKS[0]?.redirectUrl ?? ""
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleAddMoney = async () => {
    setError("");

    if (amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await createOnRampTransaction(
        amount * 100,
        provider
      );

      if (!response.success) {
        setError(response.message);
        return;
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);

      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label="Amount"
          placeholder="Amount"
          type="number"
          value={amount === 0 ? "" : amount.toString()}
          onChange={(value) => setAmount(Number(value))}
          disabled={loading}
        />

        <div className="py-4 text-left">
          Bank
        </div>

        <Select
          onSelect={(value) => {
            const bank = SUPPORTED_BANKS.find(
              (b) => b.name === value
            );

            if (!bank) return;

            setProvider(bank.name);
            setRedirectUrl(bank.redirectUrl);
          }}
          options={SUPPORTED_BANKS.map((bank) => ({
            key: bank.name,
            value: bank.name,
          }))}
        />

        {error && (
          <div className="pt-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            disabled={loading || amount <= 0}
            onClick={handleAddMoney}
          >
            {loading ? "Redirecting..." : "Add Money"}
          </Button>
        </div>
      </div>
    </Card>
  );
};