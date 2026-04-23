"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PayPage() {
  const params = useSearchParams();

  const upi = params.get("upi");
  const name = params.get("name");

  const [amount, setAmount] = useState("");

  const handlePay = () => {
    if (!amount) {
      alert("Enter amount");
      return;
    }

    alert(`Paying ₹${amount} to ${name}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Payment</h1>

      <div className="mb-4">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>UPI ID:</strong> {upi}</p>
      </div>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handlePay}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Pay
      </button>
    </div>
  );
}