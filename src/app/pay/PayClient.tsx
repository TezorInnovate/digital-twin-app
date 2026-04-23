"use client";

import { useEffect, useState } from "react";

export default function PayClient() {
  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // 1️⃣ Read from URL first
    const searchParams = new URLSearchParams(window.location.search);
    const urlUpi = searchParams.get("upi");
    const urlName = searchParams.get("name");

    if (urlUpi && urlName) {
      setUpi(urlUpi);
      setName(urlName);

      // 2️⃣ Save to localStorage
      localStorage.setItem("upi", urlUpi);
      localStorage.setItem("name", urlName);
    } else {
      // 3️⃣ Fallback to localStorage if URL is empty (reload case)
      const storedUpi = localStorage.getItem("upi") || "";
      const storedName = localStorage.getItem("name") || "";
      setUpi(storedUpi);
      setName(storedName);
    }
  }, []);

  const handlePay = () => {
    if (!amount) return alert("Enter amount");
    alert(`Paying ₹${amount} to ${name} (${upi})`);
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