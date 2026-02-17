const Company = require("../models/Company");

exports.addCompany = async (req, res) => {
  const userId = req.user.id;
  try {
    const { companyName } = req.body;
    // Validation: Check for missing fields
    if (!companyName) {
      return res.status(400).json({ message: "Company Name is required" });
    }
    const newCompany = new Company({
      userId,
      companyName
    });
    await newCompany.save();
    res.status(200).json(newCompany);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllCompany = async (req, res) => {

  const userId = req.user.id;
  try {
    const companies = await Company
      .find({ userId })
    res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });

  }
};
