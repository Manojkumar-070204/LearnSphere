const mongoose = require("mongoose")

const enrollmentSchema = new mongoose.Schema(
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

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
)

const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

module.exports = Enrollment
