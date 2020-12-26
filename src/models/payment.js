const mongoose = require('../config/mongoose');
const { v4: uuidv4 } = require('uuid');

const PaymentSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    id_payment: { type: String, required: true },
    pagador: { type: String, required: true, lowercase: true },
    status: { type: String, default:'Nada', },
    usersActive: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
});

  const Payment = mongoose.model("payment", PaymentSchema);
  
  module.exports = Payment;