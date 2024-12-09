require("dotenv").config();
const express=require("express");
const app=express();
const connect=require("./config/db")
const cors = require("cors");
const userRouter=require("./Controller/User.routes");
app.use(cors({
    origin: process.env.FRONTEND_URL
}))


app.use(express.json());
app.use("/users",userRouter);

app.get("/health",(req,res)=>{
res.send("Connected!")
})

app.listen(process.env.PORT,async()=>{
    await connect();
console.log(`LIstening on Port${process.env.PORT}`)
})