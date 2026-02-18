const express = require("express");
const {
  addExpenseCategory,
  getAllExpenseCategory,
  getExpenseCategoriesByType,
} = require("../controllers/expenseCategoryController");


const router = express.Router();
router.post("/add", addExpenseCategory);
router.get("/get", getAllExpenseCategory);
router.get("/get/:type", getExpenseCategoriesByType);

module.exports = router;
