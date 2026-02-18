const express = require("express");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { formidable } = require("formidable");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getuser", protect, getUserInfo);

router.post("/upload-image", (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({ message: "Invalid form data" });
      }

      const uploadedFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;

      if (!uploadedFile?.filepath) {
        return res.status(400).json({
          message: "Image file is required in `image` field",
        });
      }

      const result = await cloudinary.uploader.upload(uploadedFile.filepath, {
        folder: "expense-tracker/profile-images",
        resource_type: "image",
      });

      return res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error uploading image" });
    }
  });
});

module.exports = router;
