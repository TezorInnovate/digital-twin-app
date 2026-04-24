import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

// Helper function to handle GET requests for dashboard data
async function handleGet(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userPhone = url.searchParams.get("userPhone")?.trim();

    console.log("DEBUG: /api/dashboard GET request received. userPhone:", userPhone);

    if (!userPhone) {
      return NextResponse.json(
        { success: false, message: "userPhone query parameter is required" },
        { status: 400 }
      );
    }

    // Fetch all transactions for the user
    const transactions = await Transaction.find({
      userPhone: { $regex: `^${userPhone}$`, $options: "i" },
    }).sort({ createdAt: -1 });

    console.log(`DEBUG: Found ${transactions.length} transactions`);

    // Calculate dashboard metrics
    const balance = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);

    const totalSpending = transactions
      .filter((txn) => txn.amount && txn.amount < 0)
      .reduce((sum, txn) => sum + Math.abs(txn.amount || 0), 0);

    const paymentCounts: Record<string, number> = {};
    const categoryStats: Record<string, number> = {};

    transactions.forEach((txn) => {
      const name = txn.name || "Unknown";
      const cat = txn.category || "Uncategorized";

      paymentCounts[name] = (paymentCounts[name] || 0) + 1;
      categoryStats[cat] = (categoryStats[cat] || 0) + (txn.amount || 0);
    });

    const topPayments = Object.entries(paymentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return NextResponse.json({
      success: true,
      transactions,
      balance,
      totalSpending,
      topPayments,
      categoryStats,
    });
  } catch (error) {
    console.error("DEBUG: /api/dashboard GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// Main handler
export async function GET(req: Request) {
  return handleGet(req);
}