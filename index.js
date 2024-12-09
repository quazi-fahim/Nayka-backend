require("dotenv").config();
const express=require("express");
const app=express();
const connect=require("./config/db")
const cors = require("cors");
const userRouter=require("./Controller/User.routes");

const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL,  // Local development URL
    process.env.FRONTEND_URL   // Production URL
  ];

  app.use(cors({
    origin: (origin, callback) => {
      console.log("Request Origin: ", origin); // Debugging line
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specific methods
    credentials: true,  // Allow cookies or other credentials
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