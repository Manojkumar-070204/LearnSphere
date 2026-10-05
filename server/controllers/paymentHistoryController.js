const Enrollment = require("../models/Enrollment")
const Course = require("../models/Course")

async function getPaymentHistory(req, res) {
  try {
    const userId = req.user.id

    const enrollments =
      await Enrollment.find({
        user: userId
      })
        .populate(
          "payment",
          "razorpayOrderId razorpayPaymentId amount status createdAt"
        )
        .sort({
          createdAt: -1
        })
        .lean()

    const courseIds = enrollments
      .map(
        (enrollment) =>
          enrollment.courseId
      )
      .filter(Boolean)

    const courses =
      courseIds.length > 0
        ? await Course.find({
            courseId: {
              $in: courseIds
            }
          })
            .select(
              "courseId title category price"
            )
            .lean()
        : []

    const courseMap = {}

    courses.forEach((course) => {
      courseMap[course.courseId] =
        course
    })

    const payments =
      enrollments.map(
        (enrollment) => {
          const course =
            courseMap[
              enrollment.courseId
            ]

          const payment =
            enrollment.payment

          return {
            courseId:
              enrollment.courseId,

            courseTitle:
              course?.title ||
              enrollment.courseId,

            category:
              course?.category ||
              "Course Payment",

            amount:
              Number(
                enrollment.amount ||
                  payment?.amount ||
                  course?.price ||
                  0
              ),

            paymentId:
              payment?.razorpayPaymentId ||
              "",

            orderId:
              payment?.razorpayOrderId ||
              "",

            enrolledAt:
              enrollment.createdAt,

            createdAt:
              payment?.createdAt ||
              enrollment.createdAt,

            status:
              payment?.status === "paid"
                ? "Paid"
                : payment?.status ||
                  "Paid",

            enrollmentStatus:
              enrollment.status
          }
        }
      )

    res.status(200).json({
      success: true,
      payments
    })
  } catch (error) {
    console.error(
      "Payment history error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load payment history."
    })
  }
}

module.exports = {
  getPaymentHistory
}