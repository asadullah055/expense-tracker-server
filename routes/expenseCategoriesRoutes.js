const express = require("express");
const {
  addExpenseCategory,
  getAllExpenseCategory,
} = require("../controllers/expenseCategoryController");


const router = express.Router();
router.post("/add", addExpenseCategory);
router.get("/get", getAllExpenseCategory);

module.exports = router;
