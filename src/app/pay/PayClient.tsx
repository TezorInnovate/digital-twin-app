"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PaymentStatus = "idle" | "loading" | "success" | "warning" | "blocked";

export default function PayClient() {
  const [upi, setUpi] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const router = useRouter();

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
      setUpi(localStorage.getItem("upi") || "");
      setName(localStorage.getItem("name") || "");
    }
  }, []);

  const handlePay = async () => {
    if (!amount) return alert("Enter amount");
    setStatus("loading");
    try {
      const deviceId = localStorage.getItem("device_id");
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhone: "demo-user",
          upi,
          name,
          amount: Number(amount),
          deviceId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRiskScore(data.riskScore);
        if (data.status === "SUCCESS") setStatus("success");
        else if (data.status === "WARNING") setStatus("warning");
        else if (data.status === "BLOCKED") setStatus("blocked");
        else setStatus("idle");
      } else {
        setStatus("idle");
        alert("❌ Transaction failed");
      }
    } catch (error) {
      console.error(error);
      setStatus("idle");
      alert("⚠️ Error processing payment");
    }
  };

  const statusConfig = {
    success: {
      bg: "rgba(16,185,129,0.12)",
      border: "rgba(16,185,129,0.3)",
      color: "#34d399",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
      title: "Payment Successful",
    },
    warning: {
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.3)",
      color: "#fbbf24",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      title: "Suspicious Transaction",
    },
    blocked: {
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.3)",
      color: "#f87171",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      title: "Transaction Blocked",
    },
  };

  const currentStatus = status !== "idle" && status !== "loading" ? statusConfig[status] : null;

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#4e5d7a", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 4px" }}>
              UPI Transfer
            </p>
            <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f4ff", margin: 0 }}>
              Make Payment
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

        {/* Recipient card */}
        <div
          style={{
            background: "#1a2236",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#60a5fa",
              fontSize: "18px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#f0f4ff", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {name || "Unknown"}
            </p>
            <p style={{ fontSize: "12px", color: "#4e5d7a", margin: 0, fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {upi}
            </p>
          </div>
          <div
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              fontSize: "11px",
              fontWeight: 600,
              color: "#34d399",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            VERIFIED
          </div>
        </div>

        {/* Amount input card */}
        <div
          style={{
            background: "#1a2236",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "16px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#4e5d7a",
              marginBottom: "12px",
            }}
          >
            Amount
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "4px 16px",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 600, color: "#4e5d7a", fontFamily: "'DM Mono', monospace" }}>₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "28px",
                fontWeight: 700,
                color: "#f0f4ff",
                fontFamily: "'DM Mono', monospace",
                padding: "8px 0",
                letterSpacing: "-0.02em",
                width: "100%",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            {[100, 500, 1000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(String(amt))}
                style={{
                  flex: 1,
                  padding: "6px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#8896b3",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "all 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.background = "rgba(234,179,8,0.1)");
                  (e.currentTarget.style.color = "#eab308");
                  (e.currentTarget.style.borderColor = "rgba(234,179,8,0.2)");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.background = "rgba(255,255,255,0.04)");
                  (e.currentTarget.style.color = "#8896b3");
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)");
                }}
              >
                +₹{amt >= 1000 ? `${amt / 1000}K` : amt}
              </button>
            ))}
          </div>
        </div>

        {/* Status message */}
        {currentStatus && (
          <div
            style={{
              background: currentStatus.bg,
              border: `1px solid ${currentStatus.border}`,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ color: currentStatus.color, flexShrink: 0 }}>{currentStatus.icon}</div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: currentStatus.color, margin: "0 0 2px" }}>
                {currentStatus.title}
              </p>
              {riskScore !== null && (
                <p style={{ fontSize: "12px", color: "#4e5d7a", margin: 0 }}>
                  Risk score: {riskScore}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "16px",
            background: status === "loading" ? "rgba(234,179,8,0.5)" : "#eab308",
            border: "none",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: 700,
            color: "#0d1117",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.01em",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (status !== "loading") (e.currentTarget.style.background = "#fbbf24");
          }}
          onMouseLeave={(e) => {
            if (status !== "loading") (e.currentTarget.style.background = "#eab308");
          }}
        >
          {status === "loading" ? (
            "Processing..."
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {amount ? `Pay ₹${Number(amount).toLocaleString("en-IN")}` : "Pay Now"}
            </>
          )}
        </button>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#4e5d7a", marginTop: "1rem" }}>
          Secured by AI-powered fraud detection
        </p>
      </div>
    </div>
  );
}
