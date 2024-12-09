// const express = require('express');
// require("dotenv").config();
// const router = express.Router();
// const twilio=require("twilio");
// const User=require("../Models/user.schema");

// const client=twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// router.post('/send-otp',async(req,res)=>{
//     const {email,phoneNumber}=req.body;
//     try{
//        const user=await User.findOne({email});
//     //    if(!user){
//     //        return res.status(404).json({message:"User not found"});
//     //    }
//        const otp=Math.floor(100000+Math.random()*900000).toString();
//        const otpExpiry=new Date(Date.now()+5*60*1000);
//        user.otp=otp,
//        user.otpExpiry=otpExpiry,
//        await user.save();
//    await client.message.create({
//        body:`Your OTP is ${otp}.It is valid upto 5 minutes`,
//        from:process.env.TWILIO_PHONE_NUMBER,
//        to:phoneNumber,
//    });
//    res.status(201).json({message:"OTP send Successfully"})
   
//     }catch(error){
//        console.log(error);
//        res.status(500).json({message:"Failed to send OTP Try again"})
        
//     }
// });
// router.post('/verify-otp',async(req,res)=>{
//     const {email,otp}=req.body;
//     try{
//       const user=await User.findOne({email});
//       if(!user){
//         return res.status(404).json({message:"User not found"});
//       }
//       if(user.otp===otp&&user.otpExpiry>Date.now()){
//         user.isVerified=true,
//         user.otp=null,
//         user.otpExpiry=null,
//         await user.save();
//         return res.status(200).json({ message: 'OTP verified successfully' });
//       }
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({ message: 'Failed to verify OTP' });
//     }
// });

// module.exports = router;