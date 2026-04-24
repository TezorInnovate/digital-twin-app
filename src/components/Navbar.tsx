"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ phone: string; deviceId: string } | null>(null);

  // Check localStorage for user session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Preserve device_id, remove user info
      const deviceId = localStorage.getItem("device_id");
      localStorage.clear();
      if (deviceId) localStorage.setItem("device_id", deviceId);

      // Redirect to login page
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
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left side */}
      <h1 className="text-2xl font-bold tracking-wide cursor-pointer" onClick={() => router.push("/")}>
        Digital Twin
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Navigation links */}
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="text-sm hover:opacity-70"
          >
            {item.label}
          </button>
        ))}

        <div className="text-sm opacity-80 hidden sm:block">
          Secure Financial Mirror
        </div>

        {/* Login/Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            className="text-sm underline hover:opacity-70"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-sm underline hover:opacity-70"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}