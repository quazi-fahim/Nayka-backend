const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Seller', 'Buyer'],
    default: 'Buyer',
  },
 
 
  // otp: {
  //   type: String,
  //   default: null,
  // },
  // otpExpiry: {
  //   type: Date,
  //   default: null,
  // },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
});

const User =mongoose.model('User', userSchema);
module.exports = User;
