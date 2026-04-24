import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { calculateRiskScore } from "@/utils/fraud";
import { checkUpiFraud } from "@/utils/mlModel";
import { analyzeUserBehavior } from "@/utils/behavior";

// Helper function to handle GET requests
async function handleGet(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userPhone = url.searchParams.get("userPhone");

    console.log("DEBUG: Received GET request for transactions");
    console.log("DEBUG: userPhone query parameter:", userPhone);

    if (!userPhone) {
      console.warn("DEBUG: Missing userPhone in query");
      return NextResponse.json(
        { success: false, message: "userPhone query parameter is required" },
        { status: 400 }
      );
    }

    // Robust query: trims whitespace, case-insensitive match
    const transactions = await Transaction.find({
      userPhone: { $regex: `^${userPhone.trim()}$`, $options: "i" },
    }).sort({ createdAt: -1 });

    console.log(`DEBUG: Found ${transactions.length} transactions for userPhone: ${userPhone}`);

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Transaction GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

// Helper function to handle POST requests
async function handlePost(req: Request) {
  try {
    await connectDB();

    const { userPhone, upi, name, amount, deviceId } = await req.json();

    const user = await User.findOne({ phone: userPhone });

    const isNewDevice = user && !user.devices.includes(deviceId);

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentTransactions = await Transaction.countDocuments({
      userPhone,
      createdAt: { $gte: oneMinuteAgo },
    });

    const pastTransactions = await Transaction.countDocuments({
      userPhone,
      upi,
    });

    const isFrequent = pastTransactions >= 3;

    const riskScore = calculateRiskScore({
      amount,
      isNewDevice,
      recentTransactions,
    });

    const mlResult = checkUpiFraud(upi);
    const behaviorAdjustment = analyzeUserBehavior({ isFrequent });
    const finalRiskScore = riskScore + mlResult.mlRisk + behaviorAdjustment;

    let status = "SUCCESS";
    if (finalRiskScore >= 70) status = "BLOCKED";
    else if (finalRiskScore >= 30) status = "WARNING";

    const txn = await Transaction.create({
      userPhone,
      upi,
      name,
      amount,
      deviceId,
      riskScore: finalRiskScore,
      status,
    });

    console.log("DEBUG: Transaction created successfully:", txn);

    return NextResponse.json({
      success: true,
      message: "Transaction processed",
      status,
      riskScore: finalRiskScore,
      mlFraud: mlResult.isFraud,
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

// Main handlers
export async function GET(req: Request) {
  return handleGet(req);
}

export async function POST(req: Request) {
  return handlePost(req);
}