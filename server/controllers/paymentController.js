const crypto = require("crypto")
const Razorpay = require("razorpay")

const Payment = require("../models/Payment")
const Enrollment = require("../models/Enrollment")
const Course = require("../models/Course")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required."
      })
    }

    const course = await Course.findOne({
      courseId
    })

    if (!course) {
      return res.status(404).json({
        message: "Course not found."
      })
    }

    const price = Number(course.price)

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      return res.status(400).json({
        message:
          "Course price is invalid."
      })
    }

    const existingEnrollment =
      await Enrollment.findOne({
        user: req.user.id,
        courseId,
        status: {
          $in: [
            "pending",
            "approved",
            "completed"
          ]
        }
      })

    if (existingEnrollment) {
      if (
        existingEnrollment.status ===
        "pending"
      ) {
        return res.status(400).json({
          message:
            "Your enrollment is already pending admin approval."
        })
      }

      return res.status(400).json({
        message:
          "You are already enrolled in this course."
      })
    }

    const order =
      await razorpay.orders.create({
        amount: Math.round(price * 100),
        currency: "INR",
        receipt: `ls_${Date.now()}`,
        notes: {
          courseId,
          userId:
            req.user.id.toString()
        }
      })

    const payment =
      await Payment.create({
        user: req.user.id,
        courseId,
        amount: price,
        razorpayOrderId:
          order.id,
        status: "created"
      })

    res.status(201).json({
      message:
        "Payment order created.",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      courseId,
      courseTitle: course.title
    })
  } catch (error) {
    console.error(
      "Create order error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to create payment order."
    })
  }
}

const verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message:
          "Payment verification details are required."
      })
    }

    const payment =
      await Payment.findOne({
        razorpayOrderId:
          razorpay_order_id,
        user: req.user.id
      })

    if (!payment) {
      return res.status(404).json({
        message:
          "Payment order not found."
      })
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${payment.razorpayOrderId}|${razorpay_payment_id}`
        )
        .digest("hex")

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      payment.status = "failed"

      await payment.save()

      return res.status(400).json({
        message:
          "Payment signature verification failed."
      })
    }

    payment.razorpayPaymentId =
      razorpay_payment_id

    payment.razorpaySignature =
      razorpay_signature

    payment.status = "paid"

    await payment.save()

    let enrollment =
      await Enrollment.findOne({
        user: req.user.id,
        courseId: payment.courseId
      })

    if (!enrollment) {
      enrollment =
        await Enrollment.create({
          user: req.user.id,
          courseId:
            payment.courseId,
          payment: payment._id,
          amount: payment.amount,
          status: "pending"
        })
    } else {
      enrollment.payment =
        payment._id

      enrollment.amount =
        payment.amount

      enrollment.status =
        "pending"

      await enrollment.save()
    }

    res.status(200).json({
      message:
        "Payment verified. Enrollment is pending admin approval.",
      courseId:
        payment.courseId,
      enrollmentStatus:
        enrollment.status
    })
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to verify payment."
    })
  }
}

const getMyCourses = async (
  req,
  res
) => {
  try {
    const enrollments =
      await Enrollment.find({
        user: req.user.id
      })
        .populate("payment")
        .sort({
          createdAt: -1
        })

    res.status(200).json({
      enrollments
    })
  } catch (error) {
    console.error(
      "Get enrollments error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to fetch enrolled courses."
    })
  }
}

const getCourseEnrollment =
  async (req, res) => {
    try {
      const { courseId } =
        req.params

      const enrollment =
        await Enrollment.findOne({
          user: req.user.id,
          courseId
        }).populate("payment")

      const approved =
        enrollment &&
        [
          "approved",
          "completed"
        ].includes(
          enrollment.status
        )

      res.status(200).json({
        enrolled: !!approved,
        enrollment:
          enrollment || null,
        status:
          enrollment?.status ||
          null
      })
    } catch (error) {
      console.error(
        "Course enrollment error:",
        error
      )

      res.status(500).json({
        message:
          "Unable to check course enrollment."
      })
    }
  }

module.exports = {
  createOrder,
  verifyPayment,
  getMyCourses,
  getCourseEnrollment
}