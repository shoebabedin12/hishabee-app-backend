// clientPayment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientPaymentSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    weightAmount: {
        type: String,
        required: true
    },
    weightType: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
},
{
  timestamps: true,
});

module.exports = mongoose.model("ClientPayment", clientPaymentSchema);
