"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = {
  name: string;
  amount: number;
  category: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [topPayments, setTopPayments] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [userPhone, setUserPhone] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // TODO: Replace with localStorage user in production
      setUserPhone("+919773666243");
    }
  }, []);

  useEffect(() => {
    if (!userPhone) return;

    const fetchDashboard = async () => {
      try {
        console.log("DEBUG: Fetching dashboard for userPhone:", userPhone);

        const res = await fetch(`/api/dashboard?userPhone=${userPhone}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();
        console.log("DEBUG: Dashboard API response:", data);

        if (!data.success) throw new Error(data.message || "API error");

        setTransactions(data.transactions || []);
        setBalance(data.balance || 0);
        setTotalSpending(data.totalSpending || 0);
        setTopPayments(data.topPayments || []);
        setCategoryStats(data.categoryStats || {});
      } catch (err) {
        console.error("DEBUG: Failed to fetch dashboard:", err);
      }
    };

    fetchDashboard();
  }, [userPhone]);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push("/scan")} className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">Scan QR</button>
          <button onClick={() => router.push("/import-csv")} className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90">Import CSV</button>
        </div>
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

      {/* Top Payments & Category Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-xl font-bold mb-4">Top Payments</h2>
        <ul className="list-disc pl-5">{topPayments.map((name) => <li key={name}>{name}</li>)}</ul>

        <h2 className="text-xl font-bold mt-6 mb-2">Category-wise Spending</h2>
        <ul className="list-disc pl-5">
          {Object.entries(categoryStats).map(([cat, amt]) => (
            <li key={cat}>{cat}: ₹{Math.abs(amt)}</li>
          ))}
        </ul>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{new Date(txn.createdAt).toLocaleString()}</td>
                  <td className="border px-4 py-2">{txn.name}</td>
                  <td className="border px-4 py-2">{txn.category || "Uncategorized"}</td>
                  <td className="border px-4 py-2">{txn.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}