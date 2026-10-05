const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student"
    },

    photo: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    expertise: {
      type: String,
      default: ""
    },

    experience: {
      type: String,
      default: ""
    },

    disabled: {
      type: Boolean,
      default: false
    },

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User
