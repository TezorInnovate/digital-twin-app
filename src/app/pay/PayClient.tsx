// /app/pay/PayClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PayClient() {
  const searchParams = useSearchParams();
  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Try to get from query params first
    const qrUpi = searchParams.get("upi");
    const qrName = searchParams.get("name");

    if (qrUpi && qrName) {
      setUpi(qrUpi);
      setName(qrName);

      // Persist to localStorage
      localStorage.setItem("upi", qrUpi);
      localStorage.setItem("name", qrName);
    } else {
      // If no query params, load from localStorage
      const storedUpi = localStorage.getItem("upi");
      const storedName = localStorage.getItem("name");

      if (storedUpi && storedName) {
        setUpi(storedUpi);
        setName(storedName);
      }
    }
  }, [searchParams]);

  const handlePay = () => {
    if (!amount) return alert("Enter amount");
    alert(`Paying ₹${amount} to ${name} (${upi})`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Payment Page</h1>

      {upi && name ? (
        <>
          <p><strong>UPI:</strong> {upi}</p>
          <p><strong>Name:</strong> {name}</p>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="₹0"
            className="border p-2 w-full mt-3 rounded"
          />

          <button
            onClick={handlePay}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
          >
            Pay Now
          </button>
        </>
      ) : (
        <p className="text-red-500">Invalid QR data. Please check the QR code.</p>
      )}
    </div>
  );
}