import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userPhone, upi, name, amount, deviceId } = await req.json();

    const txn = await Transaction.create({
      userPhone,
      upi,
      name,
      amount,
      deviceId,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      message: "Transaction initiated",
      txnId: txn._id,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Transaction failed",
      error,
    });
  }
}