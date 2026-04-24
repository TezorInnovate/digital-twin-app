"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [data, setData] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
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
          setScanning(false);
          const parsed = parseUPI(decodedText);
          if (parsed?.upi) {
            try {
              await scanner.stop();
              router.push(
                `/pay?upi=${encodeURIComponent(parsed.upi)}&name=${encodeURIComponent(parsed.name || "")}`
              );
            } catch (err) {
              console.error("Scanner stop error:", err);
            }
          }
        },
        () => {}
      )
      .catch((err) => console.error("Camera start failed:", err));

    return () => { scanner.stop().catch(() => {}); };
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
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Outfit', sans-serif",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#4e5d7a", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 4px" }}>
              UPI
            </p>
            <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f4ff", margin: 0 }}>
              Scan QR Code
            </h1>
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8896b3",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f4ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8896b3")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>
        </div>

        {/* Scanner card */}
        <div
          style={{
            background: "#1a2236",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: scanning ? "rgba(16,185,129,0.1)" : "rgba(234,179,8,0.1)",
              border: `1px solid ${scanning ? "rgba(16,185,129,0.25)" : "rgba(234,179,8,0.25)"}`,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: scanning ? "#34d399" : "#eab308",
                animation: scanning ? "pulse 1.5s ease infinite" : "none",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: scanning ? "#34d399" : "#eab308",
                letterSpacing: "0.04em",
              }}
            >
              {scanning ? "SCANNING" : "DETECTED"}
            </span>
          </div>

          {/* Scanner viewport */}
          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#0d1117",
            }}
          >
            {/* Corner guides */}
            {[
              { top: 8, left: 8 },
              { top: 8, right: 8 },
              { bottom: 8, left: 8 },
              { bottom: 8, right: 8 },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  borderColor: "#eab308",
                  borderStyle: "solid",
                  borderWidth: 0,
                  borderTopWidth: i < 2 ? "2px" : 0,
                  borderBottomWidth: i >= 2 ? "2px" : 0,
                  borderLeftWidth: i % 2 === 0 ? "2px" : 0,
                  borderRightWidth: i % 2 !== 0 ? "2px" : 0,
                  zIndex: 2,
                  ...pos,
                }}
              />
            ))}
            <div id="reader" style={{ width: "300px" }} />
          </div>

          <p style={{ fontSize: "13px", color: "#4e5d7a", textAlign: "center", margin: 0 }}>
            Point your camera at any UPI QR code
          </p>
        </div>

        {/* Result card (shown after scan) */}
        {parsed && (
          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "16px",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p style={{ fontSize: "12px", color: "#10b981", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>
              QR Detected — Redirecting...
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#4e5d7a" }}>Name</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#f0f4ff" }}>{parsed.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#4e5d7a" }}>UPI ID</span>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#f0f4ff", fontFamily: "'DM Mono', monospace" }}>{parsed.upi}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
