const express = require("express");
const { addCompany, getAllCompany } = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");



const router = express.Router();
router.post("/add", protect, addCompany);
router.get("/get",protect, getAllCompany);

module.exports = router;
