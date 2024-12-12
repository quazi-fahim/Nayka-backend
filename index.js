
const express=require("express");
const app=express();
const connect=require("./config/db")
const cors = require("cors");
const userRouter=require("./Controller/User.routes");
const ProductRouter=require("./Controller/product.routes");
const BrandRoute=require("./Controller/Brands");
const Cart=require("./Controller/Cart.routes")
const Category=require("./Controller/Category");
require("dotenv").config();
app.use(cors({
    origin: "*",
}))


app.use(express.json());
app.use(logger);
app.use("/users",userRouter);
app.use("/products",ProductRouter);
app.use("/cart",Cart)
app.use("/brands",BrandRoute)
app.use("/categories",Category);
app.get("/health",(req,res)=>{
res.send("Connected!")
})

app.listen(process.env.PORT,async()=>{
    await connect();
console.log(`LIstening on Port${process.env.PORT}`)
});