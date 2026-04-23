export default function Navbar() {
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

        <a href="/login" className="text-sm underline hover:opacity-70">
          Login
        </a>
      </div>

    </nav>
  );
}