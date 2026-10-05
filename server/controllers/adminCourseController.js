const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")
const LearningProgress =
  require("../models/LearningProgress")
const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select(
        "courseId title description category price duration image instructor modules createdAt updatedAt"
      )
      .populate(
        "instructor",
        "name email photo bio expertise experience"
      )
      .sort({
        createdAt: -1
      })
      .lean()

    const courseIds = courses.map(
      (course) => course.courseId
    )

    const enrollments =
      await Enrollment.find({
        courseId: {
          $in: courseIds
        }
      })
        .select(
          "courseId user amount status createdAt"
        )
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const courseData = courses.map(
      (course) => {
        const courseEnrollments =
          enrollments.filter(
            (enrollment) =>
              enrollment.courseId ===
              course.courseId
          )

        const approvedStudents =
          courseEnrollments.filter(
            (enrollment) =>
              enrollment.status ===
                "approved" ||
              enrollment.status ===
                "completed"
          ).length

        return {
          ...course,

          enrollmentCount:
            courseEnrollments.length,

          approvedStudentCount:
            approvedStudents,

          enrollments:
            courseEnrollments
        }
      }
    )

    res.status(200).json({
      success: true,
      courses: courseData
    })
  } catch (error) {
    console.error(
      "Admin courses error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load courses."
    })
  }
}

const updateAdminCourse = async (
  req,
  res
) => {
  try {
    const { courseId } =
      req.params

    const {
      title,
      description,
      category,
      price,
      duration,
      image,
      modules
    } = req.body

    const course =
      await Course.findOne({
        courseId
      })

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    if (title !== undefined) {
      course.title =
        title.trim()
    }

    if (
      description !== undefined
    ) {
      course.description =
        description
    }

    if (category !== undefined) {
      course.category =
        category.trim()
    }

    if (price !== undefined) {
      const numericPrice =
        Number(price)

      if (
        Number.isNaN(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          message:
            "Price must be a valid non-negative number."
        })
      }

      course.price =
        numericPrice
    }

    if (duration !== undefined) {
      course.duration =
        duration
    }

    if (image !== undefined) {
      course.image =
        image
    }

    if (modules !== undefined) {
      if (!Array.isArray(modules)) {
        return res.status(400).json({
          message:
            "Modules must be an array."
        })
      }

      course.modules =
        modules
    }

    await course.save()

    const updatedCourse =
      await Course.findById(
        course._id
      )
        .select(
          "courseId title description category price duration image instructor modules createdAt updatedAt"
        )
        .populate(
          "instructor",
          "name email photo bio expertise experience"
        )
        .lean()

    res.status(200).json({
      success: true,
      message:
        "Course updated successfully.",
      course:
        updatedCourse
    })
  } catch (error) {
    console.error(
      "Admin update course error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to update course."
    })
  }
}

const deleteAdminCourse = async (
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

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    await Enrollment.deleteMany({
      courseId
    })

    await Course.deleteOne({
      _id: course._id
    })

    res.status(200).json({
      success: true,
      message:
        "Course deleted successfully."
    })
  } catch (error) {
    console.error(
      "Admin delete course error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to delete course."
    })
  }
}

module.exports = {
  getAdminCourses,
  updateAdminCourse,
  deleteAdminCourse
}