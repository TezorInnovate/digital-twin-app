"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PayClient() {
  const searchParams = useSearchParams();

  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setUpi(searchParams.get("upi") || "");
    setName(searchParams.get("name") || "");
  }, [searchParams]);

  const handlePay = () => {
    alert(`Paying ₹${amount} to ${name} (${upi})`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Payment Page</h1>

      <p><strong>UPI:</strong> {upi}</p>
      <p><strong>Name:</strong> {name}</p>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mt-3 w-full"
      />

      <button
        onClick={handlePay}
        className="bg-blue-600 text-white px-4 py-2 mt-3 w-full"
      >
        Pay
      </button>
    </div>
  );
}