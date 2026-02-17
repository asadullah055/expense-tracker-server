const mongoose = require("mongoose");

const incomeCategorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Personal", "Company"],
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate category inside same type
incomeCategorySchema.index({ type: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("IncomeCategory", incomeCategorySchema);
