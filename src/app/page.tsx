"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = {
  name: string;
  amount: number;
  category: string;
};

export default function Home() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [topPayments, setTopPayments] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  const userPhone = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")!).phone
    : null;

  useEffect(() => {
    if (!userPhone) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`/api/transaction?userPhone=${userPhone}`);
        const data: Transaction[] = await res.json();

        setTransactions(data);

        // Balance
        const bal = data.reduce((acc, txn) => acc + txn.amount, 0);
        setBalance(bal);

        // Total Spending (sum of negative amounts)
        const spending = data
          .filter((txn) => txn.amount < 0)
          .reduce((acc, txn) => acc + Math.abs(txn.amount), 0);
        setTotalSpending(spending);

        // Top Payment Names
        const paymentCounts: Record<string, number> = {};
        data.forEach((txn) => {
          if (!paymentCounts[txn.name]) paymentCounts[txn.name] = 0;
          paymentCounts[txn.name]++;
        });
        const top = Object.entries(paymentCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name]) => name);
        setTopPayments(top);

        // Category stats
        const categoryMap: Record<string, number> = {};
        data.forEach((txn) => {
          if (!categoryMap[txn.category]) categoryMap[txn.category] = 0;
          categoryMap[txn.category] += txn.amount;
        });
        setCategoryStats(categoryMap);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, [userPhone]);

  return (
    <main className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => router.push("/scan")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          Scan QR
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-gray-500 text-sm">Available Balance</h2>
          <p className="text-3xl font-bold mt-2">₹{balance}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-gray-500 text-sm">Total Spending</h2>
          <p className="text-3xl font-bold mt-2">₹{totalSpending}</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-xl font-bold mb-4">Top Payments</h2>
        <ul className="list-disc pl-5">
          {topPayments.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-2">Category-wise Spending</h2>
        <ul className="list-disc pl-5">
          {Object.entries(categoryStats).map(([cat, amt]) => (
            <li key={cat}>
              {cat || "Uncategorized"}: ₹{Math.abs(amt)}
            </li>
          ))}
        </ul>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-2xl shadow-md border text-center">
          Gold Market Data
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-md border text-center">
          Stock Market Data
        </div>
      </div>
    </main>
  );
}