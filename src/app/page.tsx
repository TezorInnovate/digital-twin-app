"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = {
  name: string;
  amount: number;
  category: string;
  createdAt: string;
};

const cardStyle: React.CSSProperties = {
  background: "#1a2236",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "1.5rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#4e5d7a",
  marginBottom: "8px",
};

const CategoryBadge = ({ category }: { category: string }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    Food: { bg: "rgba(234,179,8,0.12)", color: "#eab308" },
    Transport: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
    Shopping: { bg: "rgba(168,85,247,0.12)", color: "#c084fc" },
    Entertainment: { bg: "rgba(236,72,153,0.12)", color: "#f472b6" },
    Health: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    Utilities: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
  };
  const c = colors[category] || { bg: "rgba(255,255,255,0.07)", color: "#8896b3" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
        letterSpacing: "0.03em",
      }}
    >
      {category || "Other"}
    </span>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [topPayments, setTopPayments] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserPhone("+919773666243");
    }
  }, []);

  useEffect(() => {
    if (!userPhone) return;
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/dashboard?userPhone=${userPhone}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "API error");
        setTransactions(data.transactions || []);
        setBalance(data.balance || 0);
        setTotalSpending(data.totalSpending || 0);
        setTopPayments(data.topPayments || []);
        setCategoryStats(data.categoryStats || {});
      } catch (err) {
        console.error("DEBUG: Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [userPhone]);

  const categoryEntries = Object.entries(categoryStats);
  const maxCatValue = Math.max(...categoryEntries.map(([, v]) => Math.abs(v)), 1);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: "'Outfit', sans-serif",
        padding: "2rem 1.5rem 4rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ fontSize: "13px", color: "#4e5d7a", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px" }}>
              Overview
            </p>
            <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f4ff", margin: 0 }}>
              Financial Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => router.push("/scan")}
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#34d399",
                padding: "9px 18px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.12)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M17 20h3M20 14v3"/>
              </svg>
              Scan QR
            </button>
            <button
              onClick={() => router.push("/import-csv")}
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60a5fa",
                padding: "9px 18px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.12)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Import CSV
            </button>
          </div>
        </div>

        {/* Top stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {/* Balance card */}
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #1a2236 0%, #1e2a40 100%)",
              border: "1px solid rgba(234,179,8,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(234,179,8,0.06)",
              }}
            />
            <p style={labelStyle}>Available Balance</p>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#eab308",
                margin: 0,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {loading ? "—" : `₹${balance.toLocaleString("en-IN")}`}
            </p>
            <p style={{ fontSize: "12px", color: "#4e5d7a", marginTop: "8px" }}>Current account balance</p>
          </div>

          {/* Spending card */}
          <div style={{ ...cardStyle, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(239,68,68,0.05)",
              }}
            />
            <p style={labelStyle}>Total Spending</p>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
                margin: 0,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {loading ? "—" : `₹${totalSpending.toLocaleString("en-IN")}`}
            </p>
            <p style={{ fontSize: "12px", color: "#4e5d7a", marginTop: "8px" }}>Across all categories</p>
          </div>

          {/* Transactions count */}
          <div style={{ ...cardStyle, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(59,130,246,0.05)",
              }}
            />
            <p style={labelStyle}>Transactions</p>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f0f4ff",
                margin: 0,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {loading ? "—" : transactions.length}
            </p>
            <p style={{ fontSize: "12px", color: "#4e5d7a", marginTop: "8px" }}>Total recorded payments</p>
          </div>

          {/* Top merchant */}
          <div style={{ ...cardStyle, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(168,85,247,0.05)",
              }}
            />
            <p style={labelStyle}>Top Merchant</p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#f0f4ff",
                margin: 0,
                marginTop: "6px",
              }}
            >
              {loading ? "—" : topPayments[0] || "—"}
            </p>
            <p style={{ fontSize: "12px", color: "#4e5d7a", marginTop: "8px" }}>Most frequent payee</p>
          </div>
        </div>

        {/* Middle row: Top Payments + Category Spending */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px", marginBottom: "24px" }}>

          {/* Top Payments */}
          <div style={cardStyle}>
            <p style={{ ...labelStyle, marginBottom: "16px" }}>Top Payments</p>
            {loading ? (
              <div style={{ color: "#4e5d7a", fontSize: "14px" }}>Loading...</div>
            ) : topPayments.length === 0 ? (
              <div style={{ color: "#4e5d7a", fontSize: "14px" }}>No data available</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {topPayments.map((name, i) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: i === 0 ? "rgba(234,179,8,0.15)" : "rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: i === 0 ? "#eab308" : "#4e5d7a",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: "14px", color: "#f0f4ff", fontWeight: 500 }}>{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category spending */}
          <div style={cardStyle}>
            <p style={{ ...labelStyle, marginBottom: "16px" }}>Category Breakdown</p>
            {loading ? (
              <div style={{ color: "#4e5d7a", fontSize: "14px" }}>Loading...</div>
            ) : categoryEntries.length === 0 ? (
              <div style={{ color: "#4e5d7a", fontSize: "14px" }}>No data available</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {categoryEntries.map(([cat, amt]) => {
                  const pct = (Math.abs(amt) / maxCatValue) * 100;
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                        <span style={{ fontSize: "13px", color: "#8896b3", fontWeight: 500 }}>{cat}</span>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#f0f4ff",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          ₹{Math.abs(amt).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div
                        style={{
                          height: "4px",
                          background: "rgba(255,255,255,0.07)",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: "linear-gradient(90deg, #eab308, #f59e0b)",
                            borderRadius: "2px",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <p style={{ ...labelStyle, margin: 0 }}>Recent Transactions</p>
            <span style={{ fontSize: "12px", color: "#4e5d7a" }}>{transactions.length} total</span>
          </div>

          {loading ? (
            <div style={{ color: "#4e5d7a", fontSize: "14px", padding: "2rem 0", textAlign: "center" }}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div style={{ color: "#4e5d7a", fontSize: "14px", padding: "2rem 0", textAlign: "center" }}>
              No transactions yet. Import a CSV or scan a QR to get started.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Date", "Name", "Category", "Amount"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          color: "#4e5d7a",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr
                      key={idx}
                      style={{ transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "13px",
                          color: "#4e5d7a",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          fontFamily: "'DM Mono', monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "14px",
                          color: "#f0f4ff",
                          fontWeight: 500,
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {txn.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <CategoryBadge category={txn.category} />
                      </td>
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: txn.amount < 0 ? "#ef4444" : "#10b981",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {txn.amount < 0 ? "−" : "+"}₹{Math.abs(txn.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
