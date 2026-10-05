const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const adminOnly =
  require("../middleware/adminMiddleware")

const {
  getAdminDashboard,
  createInstructor,
  updateInstructor,
  disableInstructor,
  deleteInstructor,
  updateEnrollmentStatus
} = require("../controllers/adminController")

const router = express.Router()

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
)

router.post(
  "/instructors",
  protect,
  adminOnly,
  createInstructor
)

router.put(
  "/instructors/:instructorId",
  protect,
  adminOnly,
  updateInstructor
)

router.put(
  "/instructors/:instructorId/status",
  protect,
  adminOnly,
  disableInstructor
)

router.delete(
  "/instructors/:instructorId",
  protect,
  adminOnly,
  deleteInstructor
)

router.put(
  "/enrollments/:enrollmentId/status",
  protect,
  adminOnly,
  updateEnrollmentStatus
)

module.exports = router