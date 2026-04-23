"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PayClient() {
  const searchParams = useSearchParams();

  const upi = searchParams.get("upi") || "";
  const name = searchParams.get("name") || "";

  const [amount, setAmount] = useState("");

  const handlePay = () => {
    if (!amount) {
      alert("Enter amount");
      return;
    }

    alert(`Paying ₹${amount} to ${name || "Unknown Merchant"} (${upi})`);

    // later you will replace this with:
    // - backend payment API
    // - fraud check API
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Payment Page</h1>

      <div className="mb-3">
        <p><strong>UPI:</strong> {upi}</p>
        <p><strong>Name:</strong> {name}</p>
      </div>

      {/* 💰 Amount Input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Enter Amount</label>
        <input
          type="number"
          placeholder="₹0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* 💳 Pay Button */}
      <button
        onClick={handlePay}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Pay Now
      </button>
    </div>
  );
}