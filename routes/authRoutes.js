const express = require("express");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getuser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({ imageUrl });
});

module.exports = router;
/* const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.uploader.upload(req.file.path, (error, result) => {
  if (error) {
    return res.status(500).json({ message: "Error uploading image" });
  }
  const imageUrl = result.secure_url;
  res.status(200).json({ imageUrl });
}); */