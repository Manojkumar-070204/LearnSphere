const mongoose = require("mongoose")

const learningProgressSchema = new mongoose.Schema(
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

    currentLesson: {
      type: Number,
      default: 0
    },

    currentPosition: {
      type: Number,
      default: 0
    },

    completedLessons: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true
  }
)

learningProgressSchema.index(
  { user: 1, courseId: 1 },
  { unique: true }
)

const LearningProgress =
  mongoose.model("LearningProgress", learningProgressSchema)

module.exports = LearningProgress
