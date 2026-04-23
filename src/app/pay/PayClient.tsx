"use client";

import { useEffect, useState } from "react";

export default function PayClient() {
  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlUpi = searchParams.get("upi");
    const urlName = searchParams.get("name");

    if (urlUpi && urlName) {
      setUpi(urlUpi);
      setName(urlName);

      localStorage.setItem("upi", urlUpi);
      localStorage.setItem("name", urlName);
    } else {
      const storedUpi = localStorage.getItem("upi") || "";
      const storedName = localStorage.getItem("name") || "";
      setUpi(storedUpi);
      setName(storedName);
    }
  }, []);

  const handlePay = async () => {
    if (!amount) return alert("Enter amount");

    try {
      const deviceId = localStorage.getItem("device_id");

      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPhone: "demo-user", // will replace later
          upi,
          name,
          amount: Number(amount),
          deviceId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Transaction initiated!");
      } else {
        alert("❌ Transaction failed");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error processing payment");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Payment Page</h1>

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
    </div>
  );
}