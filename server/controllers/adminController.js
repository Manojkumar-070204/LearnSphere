const User = require("../models/User")
const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")
const bcrypt = require("bcryptjs")

const getAdminDashboard = async (
  req,
  res
) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1
        })
        .lean()

    const courses =
      await Course.find()
        .select(
          "courseId title description category instructor price duration image modules createdAt"
        )
        .populate(
          "instructor",
          "name email photo bio expertise experience disabled"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const enrollments =
      await Enrollment.find()
        .populate(
          "user",
          "name email photo"
        )
        .populate(
          "payment",
          "razorpayOrderId razorpayPaymentId amount status createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const students =
      users.filter(
        (user) =>
          user.role === "student"
      )

    const instructors =
      users.filter(
        (user) =>
          user.role === "instructor"
      )

    const pendingEnrollments =
      enrollments.filter(
        (enrollment) =>
          enrollment.status ===
          "pending"
      )

    const paidPayments =
      enrollments.filter(
        (enrollment) =>
          enrollment.payment?.status ===
          "paid"
      )

    const totalRevenue =
      paidPayments.reduce(
        (total, enrollment) =>
          total +
          Number(
            enrollment.payment
              ?.amount ||
              enrollment.amount ||
              0
          ),
        0
      )

    const instructorData =
      instructors.map(
        (instructor) => {
          const instructorCourses =
            courses.filter(
              (course) =>
                course.instructor?._id
                  ?.toString() ===
                instructor._id.toString()
            )

          const instructorCourseIds =
            instructorCourses.map(
              (course) =>
                course.courseId
            )

          const instructorEnrollments =
            enrollments.filter(
              (enrollment) =>
                instructorCourseIds.includes(
                  enrollment.courseId
                ) &&
                [
                  "approved",
                  "completed"
                ].includes(
                  enrollment.status
                )
            )

          const uniqueStudentIds =
            new Set(
              instructorEnrollments
                .filter(
                  (enrollment) =>
                    enrollment.user
                )
                .map(
                  (enrollment) =>
                    enrollment.user._id.toString()
                )
            )

          return {
            id:
              instructor._id,

            name:
              instructor.name,

            email:
              instructor.email,

            photo:
              instructor.photo,

            bio:
              instructor.bio,

            expertise:
              instructor.expertise,

            experience:
              instructor.experience,

            disabled:
              instructor.disabled ||
              false,

            createdAt:
              instructor.createdAt,

            courseCount:
              instructorCourses.length,

            studentCount:
              uniqueStudentIds.size,

            courses:
              instructorCourses
          }
        }
      )

    res.status(200).json({
      success: true,

      stats: {
        totalUsers:
          users.length,

        totalStudents:
          students.length,

        totalInstructors:
          instructors.length,

        totalCourses:
          courses.length,

        totalEnrollments:
          enrollments.length,

        pendingEnrollments:
          pendingEnrollments.length,

        totalRevenue
      },

      users,

      students,

      instructors:
        instructorData,

      courses,

      enrollments
    })
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load admin dashboard."
    })
  }
}

const createInstructor = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      photo,
      bio,
      expertise,
      experience
    } = req.body

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required."
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters."
      })
    }

    const normalizedEmail =
      email.toLowerCase().trim()

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      })

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists."
      })
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )

    const instructor =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role:
          "instructor",

        photo:
          photo || "",

        bio:
          bio || "",

        expertise:
          expertise || "",

        experience:
          experience || ""
      })

    res.status(201).json({
      success: true,

      message:
        "Instructor created successfully.",

      instructor: {
        id:
          instructor._id,

        name:
          instructor.name,

        email:
          instructor.email,

        role:
          instructor.role,

        photo:
          instructor.photo,

        bio:
          instructor.bio,

        expertise:
          instructor.expertise,

        experience:
          instructor.experience
      }
    })
  } catch (error) {
    console.error(
      "Create instructor error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to create instructor."
    })
  }
}

const updateInstructor = async (
  req,
  res
) => {
  try {
    const {
      instructorId
    } = req.params

    const {
      name,
      email,
      password,
      photo,
      bio,
      expertise,
      experience
    } = req.body

    const instructor =
      await User.findOne({
        _id: instructorId,
        role: "instructor"
      })

    if (!instructor) {
      return res.status(404).json({
        message:
          "Instructor not found."
      })
    }

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
            $ne:
              instructorId
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

    if (password !== undefined) {
      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters."
        })
      }

      instructor.password =
        await bcrypt.hash(
          password,
          10
        )
    }

    if (photo !== undefined) {
      instructor.photo =
        photo
    }

    if (bio !== undefined) {
      instructor.bio =
        bio
    }

    if (expertise !== undefined) {
      instructor.expertise =
        expertise
    }

    if (experience !== undefined) {
      instructor.experience =
        experience
    }

    await instructor.save()

    res.status(200).json({
      success: true,

      message:
        "Instructor updated successfully.",

      instructor: {
        id:
          instructor._id,

        name:
          instructor.name,

        email:
          instructor.email,

        role:
          instructor.role,

        photo:
          instructor.photo,

        bio:
          instructor.bio,

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
      "Update instructor error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to update instructor."
    })
  }
}

const disableInstructor = async (
  req,
  res
) => {
  try {
    const {
      instructorId
    } = req.params

    const instructor =
      await User.findOne({
        _id: instructorId,
        role: "instructor"
      })

    if (!instructor) {
      return res.status(404).json({
        message:
          "Instructor not found."
      })
    }

    instructor.disabled =
      !instructor.disabled

    await instructor.save()

    res.status(200).json({
      success: true,

      message:
        instructor.disabled
          ? "Instructor disabled successfully."
          : "Instructor enabled successfully.",

      disabled:
        instructor.disabled
    })
  } catch (error) {
    console.error(
      "Disable instructor error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to update instructor status."
    })
  }
}

const deleteInstructor = async (
  req,
  res
) => {
  try {
    const {
      instructorId
    } = req.params

    const instructor =
      await User.findOne({
        _id: instructorId,
        role: "instructor"
      })

    if (!instructor) {
      return res.status(404).json({
        message:
          "Instructor not found."
      })
    }

    const courses =
      await Course.find({
        instructor:
          instructorId
      }).select(
        "courseId"
      )

    const courseIds =
      courses.map(
        (course) =>
          course.courseId
      )

    if (courseIds.length > 0) {
      await Enrollment.deleteMany({
        courseId: {
          $in: courseIds
        }
      })

      await Course.deleteMany({
        instructor:
          instructorId
      })
    }

    await User.deleteOne({
      _id:
        instructorId
    })

    res.status(200).json({
      success: true,
      message:
        "Instructor deleted successfully."
    })
  } catch (error) {
    console.error(
      "Delete instructor error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to delete instructor."
    })
  }
}

const updateEnrollmentStatus =
  async (req, res) => {
    try {
      const {
        enrollmentId
      } = req.params

      const {
        status
      } = req.body

      if (
        ![
          "approved",
          "rejected"
        ].includes(status)
      ) {
        return res.status(400).json({
          message:
            "Status must be approved or rejected."
        })
      }

      const enrollment =
        await Enrollment.findById(
          enrollmentId
        )

      if (!enrollment) {
        return res.status(404).json({
          message:
            "Enrollment not found."
        })
      }

      if (
        enrollment.status !==
        "pending"
      ) {
        return res.status(400).json({
          message:
            "Only pending enrollments can be approved or rejected."
        })
      }

      enrollment.status =
        status

      await enrollment.save()

      res.status(200).json({
        success: true,

        message:
          status === "approved"
            ? "Enrollment approved successfully."
            : "Enrollment rejected successfully.",

        enrollment
      })
    } catch (error) {
      console.error(
        "Update enrollment status error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to update enrollment status."
      })
    }
  }

module.exports = {
  getAdminDashboard,
  createInstructor,
  updateInstructor,
  disableInstructor,
  deleteInstructor,
  updateEnrollmentStatus
}