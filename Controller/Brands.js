const express = require("express");
const Brand = require("../Models/brand"); // Correct path based on your file structure
const router = express.Router();

// Create a new brand
router.post("/create", async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(409).json({ success: false, message: "Brand already exists." });
    }

    const brand = new Brand({ name, description, logo });
    const savedBrand = await brand.save();

    res.status(201).json({ success: true, brand: savedBrand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET a single brand by ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found." });
    }
    res.status(200).json({ success: true, brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH to update a brand by ID
router.patch("/:id", async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, logo },
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ success: false, message: "Brand not found." });
    }

    res.status(200).json({ success: true, brand: updatedBrand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE a brand by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ success: false, message: "Brand not found." });
    }

    res.status(200).json({ success: true, message: "Brand deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
