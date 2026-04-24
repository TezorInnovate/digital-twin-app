"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import Next.js router
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getDeviceId } from "@/utils/device";

export default function LoginPage() {
  const router = useRouter(); // ✅ initialize router
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const setupRecaptcha = () => {
    if (typeof window !== "undefined" && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const handleSendOTP = async () => {
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
    }
  };

  const handleVerifyOTP = async () => {
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

      // ✅ Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          phone,
          deviceId,
        })
      );

      if (data.newDevice) {
        alert("✅ New device verified and added successfully!");
      } else {
        alert("Login successful!");
      }

      // ✅ Redirect to dashboard
      router.push("/"); // root route

    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login to Digital Twin</h1>

        <input
          type="tel"
          placeholder="Enter phone number (+91...)"
          className="w-full p-3 border rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleSendOTP}
          className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90"
        >
          Send OTP
        </button>

        {showOtpInput && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:opacity-90"
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}