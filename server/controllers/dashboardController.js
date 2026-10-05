const Enrollment = require("../models/Enrollment")
const LearningProgress = require("../models/LearningProgress")

async function getStudentDashboard(req, res) {
  try {
    const userId = req.user.id

    const enrollments = await Enrollment.find({
      user: userId
    })
      .populate(
        "payment",
        "razorpayPaymentId razorpayOrderId amount status"
      )
      .sort({
        createdAt: -1
      })
      .lean()

    const dashboardCourses =
      await Promise.all(
        enrollments.map(
          async (enrollment) => {
            const courseId =
              enrollment.courseId

            const progress =
              await LearningProgress.findOne({
                user: userId,
                courseId
              }).lean()

            return {
              courseId,

              paymentId:
                enrollment.payment
                  ?.razorpayPaymentId || "",

              orderId:
                enrollment.payment
                  ?.razorpayOrderId || "",

              paymentStatus:
                enrollment.payment
                  ?.status || "",

              enrollmentStatus:
                enrollment.status,

              amount:
                enrollment.amount || 0,

              enrolledAt:
                enrollment.createdAt,

              currentLesson:
                progress?.currentLesson || 0,

              currentPosition:
                progress?.currentPosition || 0,

              completedLessons:
                progress?.completedLessons || []
            }
          }
        )
      )

    res.status(200).json({
      success: true,
      courses: dashboardCourses
    })
  } catch (error) {
    console.error(
      "Student dashboard error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load student dashboard."
    })
  }
}

module.exports = {
  getStudentDashboard
}