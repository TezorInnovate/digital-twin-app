"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function ImportCSVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = () => {
    if (!file || !phone) return alert("Select CSV and enter phone number");
    setLoading(true);
    setSuccess(false);

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

        try {
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
          if (result.success) {
            setSuccess(true);
          } else {
            alert("Import failed: " + result.message);
          }
        } catch {
          alert("Network error during import");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#f0f4ff",
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontFamily: "'Outfit', sans-serif",
        padding: "3rem 1rem 4rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "12px", color: "#4e5d7a", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Data Import
          </p>
          <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f4ff", margin: 0 }}>
            Import Transactions
          </h1>
          <p style={{ fontSize: "14px", color: "#4e5d7a", marginTop: "8px" }}>
            Upload a CSV file to bulk-import your transaction history.
          </p>
        </div>

        {/* Success state */}
        {success && (
          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ color: "#34d399" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#34d399", margin: "0 0 2px" }}>Import Successful</p>
              <p style={{ fontSize: "12px", color: "#4e5d7a", margin: 0 }}>Your transactions have been imported successfully.</p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div
          style={{
            background: "#1a2236",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Phone */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4e5d7a", marginBottom: "8px" }}>
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 9999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(234,179,8,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Initial balance */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4e5d7a", marginBottom: "8px" }}>
              Initial Balance <span style={{ color: "#4e5d7a", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <span style={{ padding: "0 14px", fontSize: "15px", color: "#4e5d7a", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>₹</span>
              <input
                type="number"
                placeholder="0"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                style={{
                  flex: 1,
                  padding: "13px 16px 13px 0",
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  color: "#f0f4ff",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4e5d7a", marginBottom: "8px" }}>
              CSV File
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "2rem",
                background: file ? "rgba(59,130,246,0.07)" : "rgba(255,255,255,0.02)",
                border: `2px dashed ${file ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ color: file ? "#60a5fa" : "#4e5d7a" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: file ? "#60a5fa" : "#8896b3", margin: "0 0 3px" }}>
                  {file ? file.name : "Choose CSV file"}
                </p>
                <p style={{ fontSize: "12px", color: "#4e5d7a", margin: 0 }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "Click to browse or drag & drop"}
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* CSV format hint */}
          <div
            style={{
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
            }}
          >
            <p style={{ fontSize: "11px", color: "#4e5d7a", margin: "0 0 6px", fontWeight: 600, letterSpacing: "0.04em" }}>
              EXPECTED CSV COLUMNS
            </p>
            <p style={{ fontSize: "12px", color: "#4e5d7a", margin: 0, fontFamily: "'DM Mono', monospace", lineHeight: 1.7 }}>
              date, time, type, person_name, upi_id, category, amount
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "rgba(234,179,8,0.5)" : "#eab308",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 700,
              color: "#0d1117",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget.style.background = "#fbbf24");
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget.style.background = "#eab308");
            }}
          >
            {loading ? (
              "Importing..."
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Import CSV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
