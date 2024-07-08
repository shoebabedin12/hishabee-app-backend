const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    macAddress: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Disconnect",
      required: true,
    },
    paymentDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: "ClientPayment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);
