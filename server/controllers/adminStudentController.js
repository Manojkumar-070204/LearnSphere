const User = require("../models/User")
const Enrollment = require("../models/Enrollment")
const Course = require("../models/Course")
const LearningProgress = require("../models/LearningProgress")

const getStudents = async (
  req,
  res
) => {
  try {
    const students =
      await User.find({
        role: "student"
      })
        .select("-password")
        .sort({
          createdAt: -1
        })
        .lean()

    const studentIds =
      students.map(
        (student) =>
          student._id
      )

    const enrollments =
      await Enrollment.find({
        user: {
          $in: studentIds
        }
      })
        .populate(
          "payment",
          "razorpayOrderId razorpayPaymentId amount status createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const courseIds =
      enrollments.map(
        (enrollment) =>
          enrollment.courseId
      )

    const courses =
      await Course.find({
        courseId: {
          $in: courseIds
        }
      })
        .select(
          "courseId title category price instructor"
        )
        .populate(
          "instructor",
          "name email photo"
        )
        .lean()

    const progressRecords =
      await LearningProgress.find({
        user: {
          $in: studentIds
        },
        courseId: {
          $in: courseIds
        }
      }).lean()

    const courseMap = {}

    courses.forEach((course) => {
      courseMap[course.courseId] =
        course
    })

    const progressMap = {}

    progressRecords.forEach(
      (progress) => {
        progressMap[
          `${progress.user}_${progress.courseId}`
        ] = progress
      }
    )

    const studentData =
      students.map(
        (student) => {
          const studentEnrollments =
            enrollments.filter(
              (enrollment) =>
                enrollment.user
                  ?.toString() ===
                student._id.toString()
            )

          const studentCourses =
            studentEnrollments.map(
              (enrollment) => {
                const course =
                  courseMap[
                    enrollment.courseId
                  ]

                const progress =
                  progressMap[
                    `${student._id}_${enrollment.courseId}`
                  ]

                return {
                  courseId:
                    enrollment.courseId,

                  courseTitle:
                    course?.title ||
                    enrollment.courseId,

                  category:
                    course?.category ||
                    "",

                  instructor:
                    course?.instructor ||
                    null,

                  amount:
                    enrollment.amount ||
                    enrollment.payment
                      ?.amount ||
                    course?.price ||
                    0,

                  enrollmentStatus:
                    enrollment.status,

                  paymentStatus:
                    enrollment
                      .payment
                      ?.status || "",

                  orderId:
                    enrollment
                      .payment
                      ?.razorpayOrderId ||
                    "",

                  paymentId:
                    enrollment
                      .payment
                      ?.razorpayPaymentId ||
                    "",

                  enrolledAt:
                    enrollment.createdAt,

                  currentLesson:
                    progress?.currentLesson ||
                    0,

                  currentPosition:
                    progress?.currentPosition ||
                    0,

                  completedLessons:
                    progress
                      ?.completedLessons ||
                    []
                }
              }
            )

          return {
            id:
              student._id,

            name:
              student.name,

            email:
              student.email,

            photo:
              student.photo,

            disabled:
              student.disabled ||
              false,

            createdAt:
              student.createdAt,

            enrollmentCount:
              studentCourses.length,

            approvedCourseCount:
              studentCourses.filter(
                (course) =>
                  [
                    "approved",
                    "completed"
                  ].includes(
                    course.enrollmentStatus
                  )
              ).length,

            pendingCourseCount:
              studentCourses.filter(
                (course) =>
                  course.enrollmentStatus ===
                  "pending"
              ).length,

            courses:
              studentCourses
          }
        }
      )

    res.status(200).json({
      success: true,
      students:
        studentData
    })
  } catch (error) {
    console.error(
      "Get students error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load students."
    })
  }
}

const updateStudent = async (
  req,
  res
) => {
  try {
    const {
      studentId
    } = req.params

    const {
      name,
      email,
      photo
    } = req.body

    const student =
      await User.findOne({
        _id: studentId,
        role: "student"
      })

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found."
      })
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message:
            "Name cannot be empty."
        })
      }

      student.name =
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
            $ne:
              studentId
          }
        })

      if (existingUser) {
        return res.status(400).json({
          message:
            "An account with this email already exists."
        })
      }

      student.email =
        normalizedEmail
    }

    if (photo !== undefined) {
      student.photo =
        photo
    }

    await student.save()

    res.status(200).json({
      success: true,

      message:
        "Student updated successfully.",

      student: {
        id:
          student._id,

        name:
          student.name,

        email:
          student.email,

        photo:
          student.photo,

        disabled:
          student.disabled
      }
    })
  } catch (error) {
    console.error(
      "Update student error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to update student."
    })
  }
}

const updateStudentStatus =
  async (req, res) => {
    try {
      const {
        studentId
      } = req.params

      const student =
        await User.findOne({
          _id: studentId,
          role: "student"
        })

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found."
        })
      }

      student.disabled =
        !student.disabled

      await student.save()

      res.status(200).json({
        success: true,

        message:
          student.disabled
            ? "Student disabled successfully."
            : "Student enabled successfully.",

        disabled:
          student.disabled
      })
    } catch (error) {
      console.error(
        "Update student status error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to update student status."
      })
    }
  }

const deleteStudent = async (
  req,
  res
) => {
  try {
    const {
      studentId
    } = req.params

    const student =
      await User.findOne({
        _id: studentId,
        role: "student"
      })

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found."
      })
    }

    await LearningProgress.deleteMany({
      user: studentId
    })

    await Enrollment.deleteMany({
      user: studentId
    })

    await User.deleteOne({
      _id: studentId
    })

    res.status(200).json({
      success: true,
      message:
        "Student and related enrollment data deleted successfully."
    })
  } catch (error) {
    console.error(
      "Delete student error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to delete student."
    })
  }
}

module.exports = {
  getStudents,
  updateStudent,
  updateStudentStatus,
  deleteStudent
}