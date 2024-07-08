const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    prefix: {
      type: String,
      required: [true, "Phone is required"]
    },
    phone: {
      type: String,
      required: [true, "Phone is required"]
    },
    gender: {
      type: String,
      required: [true, "Gender is required"]
    },
    agreement: {
      type: Boolean,
      required: [true, "Gender is required"]
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('users', userSchema);