const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    incomeTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncomeCategory",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    icon: { type: String },
    source: { type: String }, // Legacy field (optional)
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Income", IncomeSchema);
