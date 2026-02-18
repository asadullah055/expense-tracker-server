const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.query;

    if (!workspaceId || !isValidObjectId(workspaceId)) {
      return res.status(400).json({ message: "Valid workspaceId is required" });
    }

    const userIdObj = new Types.ObjectId(userId);
    const workspaceIdObj = new Types.ObjectId(workspaceId);
    const withCategoryName = (txn, type) => {
      const obj = txn.toObject();
      const category =
        type === "income"
          ? obj.incomeTypeId?.category || null
          : obj.expenseTypeId?.category || null;

      return {
        _id: obj._id,
        userId: obj.userId,
        workspaceId: obj.workspaceId,
        amount: obj.amount,
        category,
        type,
        date: obj.date,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        incomeTypeId: obj.incomeTypeId,
        expenseTypeId: obj.expenseTypeId,
        __v: obj.__v,
      };
    };

    //fetch total income and expense
    const totalIncome = await Income.aggregate([
      { $match: { userId: userIdObj, workspaceId: workspaceIdObj } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userIdObj, workspaceId: workspaceIdObj } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    // get income transactions in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId: userIdObj,
      workspaceId: workspaceIdObj,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    })
      .populate("incomeTypeId", "category type")
      .sort({ date: -1 });

    // get total income and expense for the last 60 days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    // get expense transactions in the last 60 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userIdObj,
      workspaceId: workspaceIdObj,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    })
      .populate("expenseTypeId", "category type")
      .sort({ date: -1 });

    // get total expense for the last 30 days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    // fetch recent 5 transactions
    // Fetch last 5 transactions (income + expenses)

    const lastTransactions = [
      ...(await Income.find({ userId: userIdObj, workspaceId: workspaceIdObj })
        .populate("incomeTypeId", "category type")
        .sort({ date: -1 })
        .limit(5)).map((txn) => withCategoryName(txn, "income")),

      ...(await Expense.find({ userId: userIdObj, workspaceId: workspaceIdObj })
        .populate("expenseTypeId", "category type")
        .sort({ date: -1 })
        .limit(5)).map((txn) => withCategoryName(txn, "expense")),
    ].sort((a, b) => b.date - a.date);

    const last60DaysIncomeWithCategory = last60DaysIncomeTransactions.map((txn) =>
      withCategoryName(txn, "income"),
    );

    const last30DaysExpenseWithCategory = last30DaysExpenseTransactions.map((txn) =>
      withCategoryName(txn, "expense"),
    );

    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),

      totalIncome: totalIncome[0]?.total || 0,

      totalExpenses: totalExpense[0]?.total || 0,

      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseWithCategory,
      },

      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeWithCategory,
      },

      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
