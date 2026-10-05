const User = require("../models/User")
const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")

const getInstructorProfile = async (
  req,
  res
) => {
  try {
    const instructor =
      await User.findOne({
        _id: req.user.id,
        role: "instructor"
      })
        .select(
          "name email photo bio expertise experience disabled createdAt"
        )
        .lean()

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message:
          "Instructor not found."
      })
    }

    const courses =
      await Course.find({
        instructor: instructor._id
      })
        .select(
          "courseId title category price duration image modules createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const courseIds =
      courses.map(
        (course) =>
          course.courseId
      )

    const enrollments =
      await Enrollment.find({
        courseId: {
          $in: courseIds
        },
        status: {
          $in: [
            "approved",
            "completed"
          ]
        }
      })
        .select(
          "user courseId status amount createdAt"
        )
        .populate(
          "user",
          "name email photo"
        )
        .lean()

    const uniqueStudents =
      new Set(
        enrollments
          .filter(
            (enrollment) =>
              enrollment.user
          )
          .map(
            (enrollment) =>
              enrollment.user._id.toString()
          )
      )

    res.status(200).json({
      success: true,

      instructor: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        photo: instructor.photo,
        bio: instructor.bio,
        expertise:
          instructor.expertise,
        experience:
          instructor.experience,
        disabled:
          instructor.disabled || false,
        createdAt:
          instructor.createdAt,

        courseCount:
          courses.length,

        studentCount:
          uniqueStudents.size,

        courses
      }
    })
  } catch (error) {
    console.error(
      "Get instructor profile error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load instructor profile."
    })
  }
}

const updateInstructorProfile =
  async (req, res) => {
    try {
      const instructor =
        await User.findOne({
          _id: req.user.id,
          role: "instructor"
        })

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message:
            "Instructor not found."
        })
      }

      const {
        name,
        email,
        photo,
        bio,
        expertise,
        experience
      } = req.body

      if (name !== undefined) {
        if (!name.trim()) {
          return res.status(400).json({
            message:
              "Name cannot be empty."
          })
        }

        instructor.name =
          name.trim()
      }

      if (email !== undefined) {
        const normalizedEmail =
          email.toLowerCase().trim()

        if (!normalizedEmail) {
          return res.status(400).json({
            message:
              "Email cannot be empty."
          })
        }

        const existingUser =
          await User.findOne({
            email:
              normalizedEmail,
            _id: {
              $ne: instructor._id
            }
          })

        if (existingUser) {
          return res.status(400).json({
            message:
              "An account with this email already exists."
          })
        }

        instructor.email =
          normalizedEmail
      }

      if (photo !== undefined) {
        instructor.photo =
          photo
      }

      if (bio !== undefined) {
        instructor.bio =
          bio
      }

      if (
        expertise !== undefined
      ) {
        instructor.expertise =
          expertise
      }

      if (
        experience !== undefined
      ) {
        instructor.experience =
          experience
      }

      await instructor.save()

      res.status(200).json({
        success: true,
        message:
          "Instructor profile updated successfully.",

        instructor: {
          id: instructor._id,
          name: instructor.name,
          email: instructor.email,
          photo: instructor.photo,
          bio: instructor.bio,
          expertise:
            instructor.expertise,
          experience:
            instructor.experience,
          disabled:
            instructor.disabled
        }
      })
    } catch (error) {
      console.error(
        "Update instructor profile error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to update instructor profile."
      })
    }
  }

module.exports = {
  getInstructorProfile,
  updateInstructorProfile
}