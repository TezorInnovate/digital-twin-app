import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userPhone: String,
  upi: String,
  name: String,
  amount: Number,
  deviceId: String,
  riskScore: { type: Number, default: 0 },
  status: { type: String, default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);