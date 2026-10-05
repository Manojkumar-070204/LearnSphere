const Enrollment = require("../models/Enrollment")
const Course = require("../models/Course")
const Payment = require("../models/Payment")

const getAdminEnrollments = async (
  req,
  res
) => {
  try {
    const enrollments =
      await Enrollment.find()
        .populate(
          "user",
          "name email photo disabled"
        )
        .populate(
          "payment",
          "razorpayOrderId razorpayPaymentId razorpaySignature amount status createdAt"
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
          "courseId title category price instructor image"
        )
        .populate(
          "instructor",
          "name email photo"
        )
        .lean()

    const courseMap = {}

    courses.forEach((course) => {
      courseMap[course.courseId] =
        course
    })

    const formattedEnrollments =
      enrollments.map(
        (enrollment) => {
          const course =
            courseMap[
              enrollment.courseId
            ]

          return {
            id:
              enrollment._id,

            courseId:
              enrollment.courseId,

            courseTitle:
              course?.title ||
              enrollment.courseId,

            category:
              course?.category ||
              "",

            coursePrice:
              course?.price ||
              enrollment.amount ||
              0,

            courseImage:
              course?.image ||
              "",

            instructor:
              course?.instructor ||
              null,

            student:
              enrollment.user ||
              null,

            amount:
              enrollment.amount ||
              enrollment.payment
                ?.amount ||
              0,

            enrollmentStatus:
              enrollment.status,

            paymentStatus:
              enrollment.payment
                ?.status ||
              "",

            orderId:
              enrollment.payment
                ?.razorpayOrderId ||
              "",

            paymentId:
              enrollment.payment
                ?.razorpayPaymentId ||
              "",

            signature:
              enrollment.payment
                ?.razorpaySignature ||
              "",

            enrolledAt:
              enrollment.createdAt,

            updatedAt:
              enrollment.updatedAt
          }
        }
      )

    const pendingCount =
      formattedEnrollments.filter(
        (enrollment) =>
          enrollment.enrollmentStatus ===
          "pending"
      ).length

    const approvedCount =
      formattedEnrollments.filter(
        (enrollment) =>
          enrollment.enrollmentStatus ===
          "approved"
      ).length

    const rejectedCount =
      formattedEnrollments.filter(
        (enrollment) =>
          enrollment.enrollmentStatus ===
          "rejected"
      ).length

    const completedCount =
      formattedEnrollments.filter(
        (enrollment) =>
          enrollment.enrollmentStatus ===
          "completed"
      ).length

    const paidEnrollments =
      formattedEnrollments.filter(
        (enrollment) =>
          enrollment.paymentStatus ===
          "paid"
      )

    const totalRevenue =
      paidEnrollments.reduce(
        (total, enrollment) =>
          total +
          Number(
            enrollment.amount || 0
          ),
        0
      )

    res.status(200).json({
      success: true,

      stats: {
        total:
          formattedEnrollments.length,

        pending:
          pendingCount,

        approved:
          approvedCount,

        rejected:
          rejectedCount,

        completed:
          completedCount,

        paid:
          paidEnrollments.length,

        totalRevenue
      },

      enrollments:
        formattedEnrollments
    })
  } catch (error) {
    console.error(
      "Admin enrollments error:",
      error
    )

    res.status(500).json({
      success: false,
      message:
        "Unable to load enrollments."
    })
  }
}

const updateAdminEnrollment =
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

        enrollment: {
          id:
            enrollment._id,

          courseId:
            enrollment.courseId,

          status:
            enrollment.status,

          updatedAt:
            enrollment.updatedAt
        }
      })
    } catch (error) {
      console.error(
        "Update admin enrollment error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to update enrollment."
      })
    }
  }

const getAdminPaymentDetails =
  async (req, res) => {
    try {
      const payments =
        await Payment.find()
          .populate(
            "user",
            "name email photo"
          )
          .sort({
            createdAt: -1
          })
          .lean()

      const courseIds =
        payments.map(
          (payment) =>
            payment.courseId
        )

      const courses =
        await Course.find({
          courseId: {
            $in: courseIds
          }
        })
          .select(
            "courseId title category instructor price"
          )
          .populate(
            "instructor",
            "name email"
          )
          .lean()

      const courseMap = {}

      courses.forEach((course) => {
        courseMap[course.courseId] =
          course
      })

      const formattedPayments =
        payments.map(
          (payment) => {
            const course =
              courseMap[
                payment.courseId
              ]

            return {
              id:
                payment._id,

              courseId:
                payment.courseId,

              courseTitle:
                course?.title ||
                payment.courseId,

              category:
                course?.category ||
                "",

              instructor:
                course?.instructor ||
                null,

              student:
                payment.user ||
                null,

              amount:
                payment.amount,

              orderId:
                payment.razorpayOrderId,

              paymentId:
                payment.razorpayPaymentId,

              signature:
                payment.razorpaySignature,

              status:
                payment.status,

              createdAt:
                payment.createdAt,

              updatedAt:
                payment.updatedAt
            }
          }
        )

      const paidCount =
        formattedPayments.filter(
          (payment) =>
            payment.status ===
            "paid"
        ).length

      const createdCount =
        formattedPayments.filter(
          (payment) =>
            payment.status ===
            "created"
        ).length

      const failedCount =
        formattedPayments.filter(
          (payment) =>
            payment.status ===
            "failed"
        ).length

      const totalRevenue =
        formattedPayments
          .filter(
            (payment) =>
              payment.status ===
              "paid"
          )
          .reduce(
            (total, payment) =>
              total +
              Number(
                payment.amount || 0
              ),
            0
          )

      res.status(200).json({
        success: true,

        stats: {
          total:
            formattedPayments.length,

          paid:
            paidCount,

          created:
            createdCount,

          failed:
            failedCount,

          totalRevenue
        },

        payments:
          formattedPayments
      })
    } catch (error) {
      console.error(
        "Admin payment details error:",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Unable to load payment details."
      })
    }
  }

module.exports = {
  getAdminEnrollments,
  updateAdminEnrollment,
  getAdminPaymentDetails
}