// models/Transaction.ts
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userPhone: { type: String, required: true },
  upi: String,
  name: String,
  amount: Number,
  category: String, // new field for CSV
  deviceId: { type: String, default: "csv-import" },
  riskScore: { type: Number, default: 0 },
  status: { type: String, default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);