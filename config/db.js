require("dotenv").config();
const mongoose=require("mongoose");

const Connect=async()=>{
try{
   await mongoose.connect(process.env.MONGODB);
   console.log("Connected to MONGODB")
}
catch(error){
    console.log("MONGODB NOT CONNECTED")
}
}
module.exports=Connect;