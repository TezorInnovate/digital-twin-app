"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PayClient() {
  const searchParams = useSearchParams();

  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Populate after hydration
    setUpi(searchParams.get("upi") || "");
    setName(searchParams.get("name") || "");
  }, [searchParams]);

  const handlePay = () => {
    if (!amount) {
      alert("Enter amount");
      return;
    }
    alert(`Paying ₹${amount} to ${name} (${upi})`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Payment Page</h1>

      <p><strong>UPI:</strong> {upi}</p>
      <p><strong>Name:</strong> {name}</p>

      <div className="mt-4">
        <label className="block mb-1">Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹0"
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        onClick={handlePay}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
}