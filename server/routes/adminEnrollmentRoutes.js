const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const adminOnly =
  require("../middleware/adminMiddleware")

const {
  getAdminEnrollments,
  updateAdminEnrollment,
  getAdminPaymentDetails
} = require("../controllers/adminEnrollmentController")

const router = express.Router()

router.get(
  "/",
  protect,
  adminOnly,
  getAdminEnrollments
)

router.put(
  "/:enrollmentId/status",
  protect,
  adminOnly,
  updateAdminEnrollment
)

router.get(
  "/payments",
  protect,
  adminOnly,
  getAdminPaymentDetails
)

module.exports = router