"use client";

import { useState } from "react";
import Papa from "papaparse"; // npm install papaparse

export default function ImportCSVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  const handleUpload = () => {
    if (!file || !phone) return alert("Select CSV and enter phone number");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;

        const transactions = data.map((row: any) => ({
          date: row.date,
          time: row.time,
          type: row.type,
          person_name: row.person_name,
          upi_id: row.upi_id,
          category: row.category,
          amount: Number(row.amount),
        }));

        const res = await fetch("/api/import-csv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            initialBalance: Number(initialBalance || 0),
            transactions,
          }),
        });

        const result = await res.json();
        if (result.success) alert("CSV imported successfully");
        else alert("Import failed: " + result.message);
      },
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Import User CSV</h1>

      <input
        type="text"
        placeholder="Enter user phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        type="number"
        placeholder="Initial Balance (optional)"
        value={initialBalance}
        onChange={(e) => setInitialBalance(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full mb-2 rounded"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-green-600 text-white py-2 rounded hover:opacity-90"
      >
        Import CSV
      </button>
    </div>
  );
}