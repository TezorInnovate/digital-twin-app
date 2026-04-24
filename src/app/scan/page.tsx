"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [data, setData] = useState<string | null>(null);
  const router = useRouter();
  const hasScanned = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (hasScanned.current) return;
          hasScanned.current = true;

          setData(decodedText);

          const parsed = parseUPI(decodedText);

          if (parsed?.upi) {
            try {
              await scanner.stop();
              router.push(
                `/pay?upi=${encodeURIComponent(parsed.upi)}&name=${encodeURIComponent(
                  parsed.name || ""
                )}`
              );
            } catch (err) {
              console.error("Scanner stop error:", err);
            }
          }
        },
        (error) => {}
      )
      .catch((err) => console.error("Camera start failed:", err));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [router]);

  const parseUPI = (qrData: string) => {
    try {
      const url = new URL(qrData);
      return { upi: url.searchParams.get("pa"), name: url.searchParams.get("pn") };
    } catch {
      return null;
    }
  };

  const parsed = data ? parseUPI(data) : null;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Scan QR Code</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90"
        >
          Dashboard
        </button>
      </div>

      <div id="reader" style={{ width: "300px" }} />

      {data && (
        <div className="mt-4">
          <p>
            <strong>Raw Data:</strong> {data}
          </p>
        </div>
      )}

      {parsed && (
        <div className="mt-4">
          <p>
            <strong>UPI ID:</strong> {parsed.upi}
          </p>
          <p>
            <strong>Name:</strong> {parsed.name}
          </p>
        </div>
      )}
    </div>
  );
}