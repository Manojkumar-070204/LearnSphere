const Enrollment = require("../models/Enrollment")
const Payment = require("../models/Payment")
const Course = require("../models/Course")

const getAdminEnrollments = async (
  req,
  res
) => {
  try {
    const enrollments =
      await Enrollment.find()
        .populate(
          "user",
          "name email photo"
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
          "courseId title category price instructor"
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

    const enrollmentData =
      enrollments.map(
        (enrollment) => {
          const course =
            courseMap[
              enrollment.courseId
            ]

          return {
            id: enrollment._id,

            student:
              enrollment.user || null,

            courseId:
              enrollment.courseId,

            courseTitle:
              course?.title ||
              enrollment.courseId,

            category:
              course?.category || "",

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
              enrollment.payment
                ?.status || "",

            orderId:
              enrollment.payment
                ?.razorpayOrderId || "",

            paymentId:
              enrollment.payment
                ?.razorpayPaymentId || "",

            enrolledAt:
              enrollment.createdAt
          }
        }
      )

    const stats = {
      total:
        enrollmentData.length,

      pending:
        enrollmentData.filter(
          (item) =>
            item.enrollmentStatus ===
            "pending"
        ).length,

      approved:
        enrollmentData.filter(
          (item) =>
            item.enrollmentStatus ===
            "approved"
        ).length,

      rejected:
        enrollmentData.filter(
          (item) =>
            item.enrollmentStatus ===
            "rejected"
        ).length,

      completed:
        enrollmentData.filter(
          (item) =>
            item.enrollmentStatus ===
            "completed"
        ).length,

      paid:
        enrollmentData.filter(
          (item) =>
            item.paymentStatus ===
            "paid"
        ).length,

      revenue:
        enrollmentData
          .filter(
            (item) =>
              item.paymentStatus ===
              "paid"
          )
          .reduce(
            (total, item) =>
              total +
              Number(item.amount || 0),
            0
          )
    }

    res.status(200).json({
      success: true,
      stats,
      enrollments:
        enrollmentData
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
      const { enrollmentId } =
        req.params

      const { status } =
        req.body

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
            "Only pending enrollments can be updated."
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
        "Admin enrollment update error:",
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
            "name email"
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
            "courseId title category"
          )
          .lean()

      const courseMap = {}

      courses.forEach((course) => {
        courseMap[course.courseId] =
          course
      })

      const paymentData =
        payments.map(
          (payment) => ({
            id: payment._id,

            student:
              payment.user || null,

            courseId:
              payment.courseId,

            courseTitle:
              courseMap[
                payment.courseId
              ]?.title ||
              payment.courseId,

            category:
              courseMap[
                payment.courseId
              ]?.category || "",

            amount:
              payment.amount,

            orderId:
              payment.razorpayOrderId,

            paymentId:
              payment.razorpayPaymentId ||
              "",

            signature:
              payment.razorpaySignature ||
              "",

            status:
              payment.status,

            createdAt:
              payment.createdAt
          })
        )

      res.status(200).json({
        success: true,
        payments:
          paymentData
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