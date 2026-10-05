const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    videoId: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: true
  }
)

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    lessons: {
      type: [lessonSchema],
      default: []
    }
  },
  {
    _id: true
  }
)

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "",
      trim: true
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    duration: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    modules: {
      type: [moduleSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

const Course =
  mongoose.model(
    "Course",
    courseSchema
  )

module.exports = Course