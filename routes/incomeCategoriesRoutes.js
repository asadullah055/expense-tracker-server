const express = require("express");
const { addIncomeCategory, getAllIncomeCategory, getIncomeCategoriesByType } = require("../controllers/IncomeCategoryController");



const router = express.Router();
router.post("/add", addIncomeCategory);
router.get("/get", getAllIncomeCategory);
router.get("/get/:type", getIncomeCategoriesByType);

module.exports = router;