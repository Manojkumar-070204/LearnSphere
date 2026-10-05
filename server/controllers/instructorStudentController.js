const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")
const User = require("../models/User")
const LearningProgress = require("../models/LearningProgress")

const getInstructorStudents = async (
  req,
  res
) => {
  try {
    const instructorId = req.user.id

    const courses =
      await Course.find({
        instructor: instructorId
      })
        .select(
          "courseId title category price"
        )
        .lean()

    const courseIds =
      courses.map(
        (course) =>
          course.courseId
      )

    if (courseIds.length === 0) {
      return res.status(200).json({
        success: true,
        students: []
      })
    }

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
        .populate(
          "user",
          "name email photo disabled createdAt"
        )
        .populate(
          "payment",
          "amount razorpayOrderId razorpayPaymentId status createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const progressRecords =
      await LearningProgress.find({
        user: {
          $in: enrollments
            .filter(
              (enrollment) =>
                enrollment.user
            )
            .map(
              (enrollment) =>
                enrollment.user._id
            )
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

    const studentMap = {}

    enrollments.forEach(
      (enrollment) => {
        if (!enrollment.user) {
          return
        }

        const studentId =
          enrollment.user._id.toString()

        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            id:
              enrollment.user._id,

            name:
              enrollment.user.name,

            email:
              enrollment.user.email,

            photo:
              enrollment.user.photo,

            disabled:
              enrollment.user
                .disabled || false,

            createdAt:
              enrollment.user
                .createdAt,

            enrollmentCount: 0,

            courses: []
          }
        }

        const course =
          courseMap[
            enrollment.courseId
          ]

        const progress =
          progressMap[
            `${studentId}_${enrollment.courseId}`
          ]

        studentMap[
          studentId
        ].enrollmentCount += 1

        studentMap[
          studentId
        ].courses.push({
          courseId:
            enrollment.courseId,

          courseTitle:
            course?.title ||
            enrollment.courseId,

          category:
            course?.category || "",

          amount:
            enrollment.amount ||
            enrollment.payment
              ?.amount ||
            0,

          enrollmentStatus:
            enrollment.status,

          paymentStatus:
            enrollment.payment
              ?.status || "",

          orderId:
            enrollment.payment
              ?.razorpayOrderId ||
            "",

          paymentId:
            enrollment.payment
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
            progress?.completedLessons ||
            []
        })
      }
    )

    res.status(200).json({
      success: true,
      students:
        Object.values(
          studentMap
        )
    })
  } catch (error) {
    console.error(
      "Instructor students error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load instructor students."
    })
  }
}

const getInstructorStudent =
  async (req, res) => {
    try {
      const instructorId =
        req.user.id

      const { studentId } =
        req.params

      const courses =
        await Course.find({
          instructor: instructorId
        })
          .select(
            "courseId title category price"
          )
          .lean()

      const courseIds =
        courses.map(
          (course) =>
            course.courseId
        )

      const enrollments =
        await Enrollment.find({
          user: studentId,
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
          .populate(
            "user",
            "name email photo disabled createdAt"
          )
          .populate(
            "payment",
            "amount razorpayOrderId razorpayPaymentId status createdAt"
          )
          .lean()

      if (enrollments.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found in instructor courses."
        })
      }

      const student =
        enrollments[0].user

      const progressRecords =
        await LearningProgress.find({
          user: studentId,
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
            progress.courseId
          ] = progress
        }
      )

      const studentCourses =
        enrollments.map(
          (enrollment) => {
            const course =
              courseMap[
                enrollment.courseId
              ]

            const progress =
              progressMap[
                enrollment.courseId
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

              amount:
                enrollment.amount ||
                enrollment.payment
                  ?.amount ||
                0,

              enrollmentStatus:
                enrollment.status,

              paymentStatus:
                enrollment.payment
                  ?.status || "",

              orderId:
                enrollment.payment
                  ?.razorpayOrderId ||
                "",

              paymentId:
                enrollment.payment
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
                progress?.completedLessons ||
                []
            }
          }
        )

      res.status(200).json({
        success: true,

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
            student.disabled ||
            false,

          createdAt:
            student.createdAt,

          enrollmentCount:
            studentCourses.length,

          courses:
            studentCourses
        }
      })
    } catch (error) {
      console.error(
        "Instructor student details error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to load student details."
      })
    }
  }

module.exports = {
  getInstructorStudents,
  getInstructorStudent
}