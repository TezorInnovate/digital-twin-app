"use client";

import { useSearchParams } from "next/navigation";

export default function PayClient() {
  const searchParams = useSearchParams();

  const upi = searchParams.get("upi") || "";
  const name = searchParams.get("name") || "";

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Payment page</h1>

      <p><strong>UPI:</strong> {upi}</p>
      <p><strong>Name:</strong> {name}</p>
    </div>
  );
}