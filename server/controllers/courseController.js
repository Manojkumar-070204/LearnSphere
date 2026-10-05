const Course = require("../models/Course")

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select(
        "courseId title description category price duration image instructor modules createdAt"
      )
      .populate(
        "instructor",
        "name email photo bio expertise experience"
      )
      .sort({
        createdAt: -1
      })
      .lean()

    res.status(200).json({
      success: true,
      courses
    })
  } catch (error) {
    console.error(
      "Get courses error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load courses."
    })
  }
}

const getCourseById = async (
  req,
  res
) => {
  try {
    const { courseId } =
      req.params

    const course =
      await Course.findOne({
        courseId
      })
        .select(
          "courseId title description category price duration image instructor modules createdAt"
        )
        .populate(
          "instructor",
          "name email photo bio expertise experience"
        )
        .lean()

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found."
      })
    }

    res.status(200).json({
      success: true,
      course
    })
  } catch (error) {
    console.error(
      "Get course error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load course."
    })
  }
}

module.exports = {
  getAllCourses,
  getCourseById
}