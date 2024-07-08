const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    month: {
      type: String
      // required: true,
    },
    startDate: {
      type: String
      // required: true,
    },
    payingDate: {
      type: String,
      // required: true,
    },
    paymentStatus: {
      type: String,
      default: "pending"
      // required: true,
    },
    paymentDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: "ClientPayment"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Client", clientSchema);
