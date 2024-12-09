const express=require("express");
const router=express.Router();
const Product=require("../Models/product.schema");
const auth=require("../Middleware/auth");
const checkAccess=require("../Middleware/Checkacess");
const Roles=require("../config/roles");
const Category=require("../Models/category");
const Brand=require("../Models/brand")

//get all product for all 
router.get("/",async(req,res)=>{
    try{
        const resultPerPage = 12;
        const productsCount = await Product.countDocuments();
        // console.log(req.query);
    
        const searchFeature = new SearchFeatures(Product.find(), req.query)
            .search()
            .filter();
    
        let products = await searchFeature.query;
        let filteredProductsCount = products.length;
    
        searchFeature.pagination(resultPerPage);
    
        products = await searchFeature.query.clone();
    
        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount,
        });
    }
    catch(error){
        res.status(500).json({ message: error.message })
    }
});

//get product details

router.get("/:id",async(req,res)=>{
    try{
        
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
    }
    catch(error){
        res.status(500).json({ message: error.message })
    }
})

///create product 

router.post("/create",auth,checkAccess(Roles.Admin||Roles.Seller),async(req,res)=>{
    try{
        const { name, category, brand, price, rating, image, description, howtouse } = req.body;
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ error: "Invalid category ID" });
        }
        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
          return res.status(400).json({ error: "Invalid brand ID" });
        }
//create
const product=new Product({
    name,category,brand,price,rating,image,description,howtouse
});
await product.save();
res.status(201).json({message:"Product Created Successfully"})
    
    }
    catch(error){
        console.error(error);
      res.status(500).json({ error: "Internal server error" }); 
    }
});

/////update 

router.patch("/update/:id", auth, checkAccess(Roles.Admin || Roles.Seller), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, brand, price, rating, image, description, howtouse } = req.body;
  
      if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ error: "Invalid category ID" });
        }
      }
  
      
      if (brand) {
        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
          return res.status(400).json({ error: "Invalid brand ID" });
        }
      }
  
      // Find and partially update the product
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: req.body }, 
        { new: true, runValidators: true } 
      );
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  



  //delete only admin 
  router.delete("/delete/:id", auth, checkAccess(Roles.Admin || Roles.Seller), async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete product
      const product = await Product.findByIdAndDelete(id);
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  