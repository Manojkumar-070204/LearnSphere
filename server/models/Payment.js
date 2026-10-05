const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    courseId: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: {
      type: String,
      default: null
    },

    razorpaySignature: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    }
  },
  {
    timestamps: true
  }
)

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment
