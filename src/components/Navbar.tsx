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

      // Clear local session
      localStorage.clear();

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Try again.");
    }
  };

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* Left side */}
      <h1 className="text-2xl font-bold tracking-wide">
        Digital Twin
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="text-sm opacity-80">
          Secure Financial Mirror
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="text-sm underline hover:opacity-70"
          >
            Logout
          </button>
        ) : (
          <a href="/login" className="text-sm underline hover:opacity-70">
            Login
          </a>
        )}
      </div>

    </nav>
  );
}