const express = require("express");
const Category = require("../Models/category"); // Correct path based on your file structure
const router = express.Router();

// Create a new category
router.post("/create", async (req, res) => {
    try {
      const { name, description } = req.body;
  
      if (!name) {
        return res.status(400).json({ success: false, message: "Name is required." });
      }
  
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(409).json({ success: false, message: "Category already exists." });
      }
  
      const category = new Category({ name, description});
      const savedCategory = await category.save();
  
      res.status(201).json({ success: true, category: savedCategory });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });


// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH to update a category by ID
router.patch("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description},
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports=router;