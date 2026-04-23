export default function Home() {
  return (
    <main className="p-6 space-y-6">

      {/* Header */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-gray-500 text-sm">Available Balance</h2>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-gray-500 text-sm">Total Spending</h2>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-white p-10 rounded-2xl shadow-md border text-center">
        <p className="text-gray-400">Spending analytics will appear here</p>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-2xl shadow-md border text-center">
          Gold Market Data
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-md border text-center">
          Stock Market Data
        </div>
      </div>

    </main>
  );
}