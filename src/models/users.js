const mongoose = require('../config/mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    payment: { type: Boolean, default:false, },
    usersActive: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
  });

  
  const User = mongoose.model("users", UserSchema);
  
  module.exports = User;