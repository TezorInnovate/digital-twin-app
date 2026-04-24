"use client";

import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ phone: string; deviceId: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const deviceId = localStorage.getItem("device_id");
      localStorage.clear();
      if (deviceId) localStorage.setItem("device_id", deviceId);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Try again.");
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Scan QR", path: "/scan" },
    { label: "Import CSV", path: "/import-csv" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: scrolled ? "rgba(13,17,23,0.95)" : "rgba(13,17,23,0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(234,179,8,0.15)" : "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.2s ease",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: 0,
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #eab308, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" fill="rgba(13,17,23,0.9)" />
            </svg>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: "#f0f4ff",
            }}
          >
            Digital<span style={{ color: "#eab308" }}>Twin</span>
          </span>
        </button>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  background: isActive ? "rgba(234,179,8,0.1)" : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#eab308" : "#8896b3",
                  transition: "all 0.15s ease",
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLButtonElement).style.color = "#f0f4ff";
                    (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLButtonElement).style.color = "#8896b3";
                    (e.target as HTMLButtonElement).style.background = "none";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "12px",
              color: "#4e5d7a",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "none",
            }}
            className="sm:block"
          >
            Secure Financial Mirror
          </span>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontSize: "12px",
                  color: "#8896b3",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {user.phone}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "'Outfit', sans-serif",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = "rgba(239,68,68,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "#eab308",
                border: "none",
                color: "#0d1117",
                cursor: "pointer",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#fbbf24";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "#eab308";
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
