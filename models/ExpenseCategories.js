const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
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
expenseCategorySchema.index({ type: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);
