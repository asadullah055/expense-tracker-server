require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connect } = require("http2");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); 
const incomeCategoryRoutes = require("./routes/incomeCategoriesRoutes");
const expenseCategoryRoutes = require("./routes/expenseCategoriesRoutes"); 
const companyRoutes = require("./routes/companyRoutes"); 
const app = express();
// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
connectDB()

app.use("/api/v1/auth", authRoutes); 
app.use("/api/v1/income", incomeRoutes); 
app.use("/api/v1/expense", expenseRoutes); 
app.use("/api/v1/dashboard", dashboardRoutes); 
app.use("/api/v1/incomecategory", incomeCategoryRoutes); 
app.use("/api/v1/expensecategory", expenseCategoryRoutes); 
app.use("/api/v1/company", companyRoutes); 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
