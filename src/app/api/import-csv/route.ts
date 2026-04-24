import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { phone, initialBalance, transactions } = await req.json();

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, devices: ["csv-import"] });
    }

    if (initialBalance && initialBalance > 0) {
      await Transaction.create({
        userPhone: phone,
        name: "Initial Balance",
        amount: initialBalance,
        category: "Balance",
        status: "SUCCESS",
        deviceId: "csv-import",
        createdAt: new Date(),
      });
    }

    const txnDocs = transactions.map((t: any) => ({
      userPhone: phone,
      name: t.person_name,
      upi: t.upi_id,
      amount: Number(t.amount),
      category: t.category || "",
      status: t.type === "Paid" ? "SUCCESS" : "SUCCESS",
      deviceId: "csv-import",
      createdAt: dayjs(`${t.date} ${t.time}`, "DD-MMM hh:mm A").toDate(),
    }));

    await Transaction.insertMany(txnDocs);

    return NextResponse.json({ success: true, message: "CSV data imported successfully" });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json({ success: false, message: "Import failed", error });
  }
}