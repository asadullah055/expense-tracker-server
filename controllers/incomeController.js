// Add Income Source

const Income = require("../models/Income");
const { isValidObjectId } = require("mongoose");
const xlsx = require("xlsx");
exports.addIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const { incomeTypeId, workspaceId, amount, date } = req.body;
    // Validation: Check for missing fields
    if (!incomeTypeId || !workspaceId || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newIncome = new Income({
      userId,
      incomeTypeId,
      amount,
      workspaceId,
      date: new Date(date),
    });
    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income Source

exports.getAllIncome = async (req, res) => {
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

    const income = await Income.find(query)
      .populate("incomeTypeId", "category type")
      .sort({ date: -1 });

    const response = income.map((item) => {
      const obj = item.toObject();
      return {
        _id: obj._id,
        userId: obj.userId,
        workspaceId: obj.workspaceId,
        amount: obj.amount,
        category: obj.incomeTypeId?.category || null,
        date: obj.date,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        incomeTypeId: obj.incomeTypeId,
        __v: obj.__v,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income Source

exports.deleteIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid income id" });
    }

    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel

exports.downloadIncomeExcel = async (req, res) => {

  const userId = req.user.id;

  try {
    const { workspaceId } = req.query;

    if (!workspaceId || !isValidObjectId(workspaceId)) {
      return res.status(400).json({ message: "Valid workspaceId is required" });
    }

    const income = await Income.find({ userId, workspaceId })
      .populate("incomeTypeId", "category")
      .sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Category: item.incomeTypeId?.category || "",
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="income_details_${workspaceId}.xlsx"`,
    );
    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
