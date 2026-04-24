"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = {
  name: string;
  amount: number;
  category: string;
  createdAt: string;
};

export default function Home() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [topPayments, setTopPayments] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [userPhone, setUserPhone] = useState<string | null>(null);

  // Only access localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      //const storedUser = localStorage.getItem("user");
      //if (storedUser) {
      //  const parsed = JSON.parse(storedUser);
      //  console.log("DEBUG: Stored user from localStorage:", parsed);
      //  setUserPhone(parsed.phone);
      //} else {
      //  console.warn("DEBUG: No user found in localStorage");
      //}
      setUserPhone("+919773666243");
    }
  }, []);

  useEffect(() => {
    if (!userPhone) {
      console.warn("DEBUG: userPhone is null, skipping fetch");
      return;
    }

    const fetchTransactions = async () => {
      try {
        console.log("DEBUG: Fetching transactions for userPhone:", userPhone);
        const res = await fetch(`/api/transaction?userPhone=${userPhone}`);
        if (!res.ok) {
          console.error("DEBUG: Fetch failed with status:", res.status);
          return;
        }

        const data: Transaction[] = await res.json();
        console.log("DEBUG: Transactions fetched:", data);

        if (!Array.isArray(data)) {
          console.error("DEBUG: API did not return an array:", data);
          return;
        }

        // Sort transactions by newest first
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedData);

        // Calculate balance
        const bal = data.reduce((acc, txn) => acc + txn.amount, 0);
        setBalance(bal);
        console.log("DEBUG: Calculated balance:", bal);

        // Total spending (sum of negative amounts)
        const spending = data
          .filter((txn) => txn.amount < 0)
          .reduce((acc, txn) => acc + Math.abs(txn.amount), 0);
        setTotalSpending(spending);
        console.log("DEBUG: Calculated total spending:", spending);

        // Top payment names
        const paymentCounts: Record<string, number> = {};
        data.forEach((txn) => {
          paymentCounts[txn.name] = (paymentCounts[txn.name] || 0) + 1;
        });
        const top = Object.entries(paymentCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name]) => name);
        setTopPayments(top);
        console.log("DEBUG: Top payments:", top);

        // Category stats
        const categoryMap: Record<string, number> = {};
        data.forEach((txn) => {
          const cat = txn.category || "Uncategorized";
          categoryMap[cat] = (categoryMap[cat] || 0) + txn.amount;
        });
        setCategoryStats(categoryMap);
        console.log("DEBUG: Category stats:", categoryMap);

      } catch (err) {
        console.error("DEBUG: Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, [userPhone]);

  return (
    <main className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/scan")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Scan QR
          </button>
          <button
            onClick={() => router.push("/import-csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Import CSV
          </button>
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
              {cat}: ₹{Math.abs(amt)}
            </li>
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