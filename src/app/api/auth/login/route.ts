import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { phone, deviceId } = await req.json();

    let user = await User.findOne({ phone });

    if (!user) {
      // New user
      user = await User.create({
        phone,
        devices: [deviceId],
      });

      return NextResponse.json({
        success: true,
        message: "New user created",
        newDevice: false,
      });
    }

    // Existing user
    if (!user.devices.includes(deviceId)) {
      return NextResponse.json({
        success: true,
        message: "New device detected",
        newDevice: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      newDevice: false,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Server error",
      error,
    });
  }
}