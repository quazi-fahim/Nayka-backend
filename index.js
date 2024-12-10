require("dotenv").config();
const express=require("express");
const app=express();
const connect=require("./config/db")
const cors = require("cors");
const userRouter=require("./Controller/User.routes");

const allowedOrigins = [
    "http://localhost:5173",
    "https://naykaclone-frontend2-l1cwkazwa-quazi-fahims-projects.vercel.app",
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies/auth headers to be sent
  }));
  


app.use(express.json());
app.use("/users",userRouter);

app.get("/health",(req,res)=>{
res.send("Connected!")
})

app.listen(process.env.PORT,async()=>{
    await connect();
console.log(`LIstening on Port${process.env.PORT}`)
})