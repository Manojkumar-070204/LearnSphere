const mongoose = require("mongoose")
const User = require("../models/User")
const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")

const instructorSlugNames = {
  arjun: "Arjun Sharma",
  ananya: "Ananya Rao",
  rahul: "Rahul Mehta",
  priya: "Priya Nair",
  vikram: "Vikram Singh",
  karan: "Karan Verma"
}

const getPublicInstructors = async (
  req,
  res
) => {
  try {
    const instructors =
      await User.find({
        role: "instructor",
        disabled: false
      })
        .select(
          "name email photo bio expertise experience createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const instructorIds =
      instructors.map(
        (instructor) =>
          instructor._id
      )

    const courses =
      await Course.find({
        instructor: {
          $in: instructorIds
        }
      })
        .select(
          "courseId title description category price duration image instructor modules createdAt"
        )
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
        .select("courseId")
        .lean()

    const instructorData =
      instructors.map(
        (instructor) => {
          const instructorCourses =
            courses.filter(
              (course) =>
                course.instructor.toString() ===
                instructor._id.toString()
            )

          const instructorCourseIds =
            instructorCourses.map(
              (course) =>
                course.courseId
            )

          const studentCount =
            enrollments.filter(
              (enrollment) =>
                instructorCourseIds.includes(
                  enrollment.courseId
                )
            ).length

          return {
            id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            photo: instructor.photo,
            bio: instructor.bio,
            expertise:
              instructor.expertise,
            experience:
              instructor.experience,
            courseCount:
              instructorCourses.length,
            studentCount,
            courses:
              instructorCourses
          }
        }
      )

    res.status(200).json({
      success: true,
      instructors:
        instructorData
    })
  } catch (error) {
    console.error(
      "Public instructors error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load instructors."
    })
  }
}

const getPublicInstructorById =
  async (req, res) => {
    try {
      const { instructorId } =
        req.params

      let instructorQuery

      if (
        mongoose.isValidObjectId(
          instructorId
        )
      ) {
        instructorQuery = {
          _id: instructorId,
          role: "instructor",
          disabled: false
        }
      } else {
        const instructorName =
          instructorSlugNames[
            String(instructorId).toLowerCase()
          ]

        if (!instructorName) {
          return res.status(404).json({
            success: false,
            message:
              "Instructor not found."
          })
        }

        instructorQuery = {
          name: instructorName,
          role: "instructor",
          disabled: false
        }
      }

      const instructor =
        await User.findOne(
          instructorQuery
        )
          .select(
            "name email photo bio expertise experience createdAt"
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
          instructor:
            instructor._id
        })
          .select(
            "courseId title description category price duration image modules createdAt"
          )
          .lean()

      const courseIds =
        courses.map(
          (course) =>
            course.courseId
        )

      const studentCount =
        await Enrollment.countDocuments({
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
          courseCount:
            courses.length,
          studentCount,
          courses
        }
      })
    } catch (error) {
      console.error(
        "Public instructor error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to load instructor."
      })
    }
  }

module.exports = {
  getPublicInstructors,
  getPublicInstructorById
}
