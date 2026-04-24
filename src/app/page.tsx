"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-gray-500 text-sm">Total Spending</h2>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-white p-10 rounded-2xl shadow-md border text-center">
        <p className="text-gray-400">Spending analytics will appear here</p>
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