// Add Expense Source

const Expense = require("../models/Expense");
const { isValidObjectId } = require("mongoose");
const xlsx = require("xlsx");
exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { expenseTypeId, workspaceId, amount, date } = req.body;
    // Validation: Check for missing fields
    if (!expenseTypeId || !workspaceId || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newExpense = new Expense({
      userId,
      expenseTypeId,
      workspaceId,
      amount,
      date: new Date(date),
    });
    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expense Source

exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { workspaceId } = req.query;
    const query = { userId };

    if (workspaceId) {
      if (!isValidObjectId(workspaceId)) {
        return res.status(400).json({ message: "Invalid workspaceId" });
      }
      query.workspaceId = workspaceId;
    }

    const expense = await Expense.find(query)
      .populate("expenseTypeId", "category type")
      .sort({ date: -1 });

    const response = expense.map((item) => {
      const obj = item.toObject();
      return {
        _id: obj._id,
        userId: obj.userId,
        workspaceId: obj.workspaceId,
        amount: obj.amount,
        category: obj.expenseTypeId?.category || null,
        date: obj.date,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        expenseTypeId: obj.expenseTypeId,
        __v: obj.__v,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense Source

exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel

exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const { workspaceId } = req.query;

    if (!workspaceId || !isValidObjectId(workspaceId)) {
      return res.status(400).json({ message: "Valid workspaceId is required" });
    }

    const expense = await Expense.find({ userId, workspaceId })
      .populate("expenseTypeId", "category")
      .sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((item) => ({
      Category: item.expenseTypeId?.category || "",
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="expense_details_${workspaceId}.xlsx"`,
    );
    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
