const IncomeCategory = require("../models/IncomeCategory");


const addIncomeCategory = async (req, res) => {

  try {

    const { type, category } = req.body;

    // Validation
    if (!type || !category) {
      return res.status(400).json({
        message: "Type and Category are required"
      });
    }

    const newCategory = new IncomeCategory({

      type,
      category
    });

    await newCategory.save();

    res.status(200).json(newCategory);

  } catch (error) {

    // Duplicate Error Handle
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists for this type"
      });
    }

    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getAllIncomeCategory = async (req, res) => {
  try {

    const categories = await IncomeCategory
      .find({})
      .sort({ createdAt: -1 }); // Latest first
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};  
const getIncomeCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params; // Personal / Company

    const categories = await IncomeCategory
      .find({ type })
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}; 
module.exports = { addIncomeCategory, getAllIncomeCategory,getIncomeCategoriesByType };
