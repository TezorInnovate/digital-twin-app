"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getDeviceId } from "@/utils/device";

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

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#eab308",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: 700,
  color: "#0d1117",
  cursor: "pointer",
  fontFamily: "'Outfit', sans-serif",
  letterSpacing: "0.01em",
  transition: "all 0.15s ease",
};

const secondaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.25)",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: 600,
  color: "#34d399",
  cursor: "pointer",
  fontFamily: "'Outfit', sans-serif",
  transition: "all 0.15s ease",
};

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (typeof window !== "undefined" && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      setShowOtpInput(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const confirmationResult = (window as any).confirmationResult;
      await confirmationResult.confirm(otp);
      const deviceId = getDeviceId();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, deviceId }),
      });
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify({ phone, deviceId }));
      if (data.newDevice) {
        alert("✅ New device verified and added successfully!");
      } else {
        alert("Login successful!");
      }
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

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
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(234,179,8,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo/brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #eab308, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="rgba(13,17,23,0.85)" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#f0f4ff",
              margin: "0 0 6px",
            }}
          >
            Welcome to Digital<span style={{ color: "#eab308" }}>Twin</span>
          </h1>
          <p style={{ fontSize: "14px", color: "#4e5d7a", margin: 0 }}>
            Your secure financial mirror
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#1a2236",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#4e5d7a",
                marginBottom: "8px",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9999999999"
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "rgba(234,179,8,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <button
            onClick={handleSendOTP}
            disabled={loading}
            style={{
              ...primaryBtnStyle,
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.background = "#fbbf24";
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.background = "#eab308";
            }}
          >
            {loading && !showOtpInput ? "Sending..." : "Send OTP"}
          </button>

          {showOtpInput && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#4e5d7a",
                  fontSize: "12px",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                OTP sent to {phone}
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#4e5d7a",
                    marginBottom: "8px",
                  }}
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="6-digit code"
                  maxLength={6}
                  style={{ ...inputStyle, letterSpacing: "0.2em", fontSize: "18px", textAlign: "center" }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                style={{
                  ...secondaryBtnStyle,
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget.style.background = "rgba(16,185,129,0.18)");
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget.style.background = "rgba(16,185,129,0.1)");
                }}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </>
          )}

          <div id="recaptcha-container" />
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#4e5d7a", marginTop: "1.5rem" }}>
          Protected by Firebase Authentication & end-to-end encryption
        </p>
      </div>
    </div>
  );
}
