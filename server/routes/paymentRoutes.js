const express = require("express")

const {
  createOrder,
  verifyPayment,
  getMyCourses,
  getCourseEnrollment
} = require("../controllers/paymentController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.post(
  "/create-order",
  protect,
  createOrder
)

router.post(
  "/verify",
  protect,
  verifyPayment
)

router.get(
  "/my-courses",
  protect,
  getMyCourses
)

router.get(
  "/course/:courseId",
  protect,
  getCourseEnrollment
)

module.exports = router