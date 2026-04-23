export default function Home() {
  return (
    <main className="p-6 space-y-6">

      {/* Top Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Balance</h2>
          <p className="text-2xl font-bold mt-2">₹0</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Total Spending</h2>
          <p className="text-2xl font-bold mt-2">₹0</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-gray-100 p-10 rounded-2xl shadow text-center">
        <p className="text-gray-500">Graphs will appear here</p>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-10 rounded-2xl shadow text-center">
          Gold Data
        </div>

        <div className="bg-gray-100 p-10 rounded-2xl shadow text-center">
          Stock Data
        </div>
      </div>

    </main>
  );
}