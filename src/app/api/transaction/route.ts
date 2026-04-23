import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { calculateRiskScore } from "@/utils/fraud";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userPhone, upi, name, amount, deviceId } = await req.json();

    // Find user by phone
    const user = await User.findOne({ phone: userPhone });

    // Check if device is new for this user
    const isNewDevice = user && !user.devices.includes(deviceId);

    // Count transactions in the last 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentTransactions = await Transaction.countDocuments({
      userPhone,
      createdAt: { $gte: oneMinuteAgo },
    });

    // Calculate risk score
    const riskScore = calculateRiskScore({
      amount,
      isNewDevice,
      recentTransactions,
    });

    // Decide transaction status based on risk
    let status: "SUCCESS" | "WARNING" | "BLOCKED" = "SUCCESS";

    if (riskScore >= 70) status = "BLOCKED";
    else if (riskScore >= 30) status = "WARNING";

    // Create the transaction
    const txn = await Transaction.create({
      userPhone,
      upi,
      name,
      amount,
      deviceId,
      riskScore,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Transaction processed",
      txnId: txn._id,
      status,
      riskScore,
    });

  } catch (error) {
    console.error("Transaction POST error:", error);
    return NextResponse.json({
      success: false,
      message: "Transaction failed",
      error: error instanceof Error ? error.message : error,
    });
  }
}