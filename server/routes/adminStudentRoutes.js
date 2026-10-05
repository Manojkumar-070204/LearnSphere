const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const adminOnly =
  require("../middleware/adminMiddleware")

const {
  getStudents,
  updateStudent,
  updateStudentStatus,
  deleteStudent
} = require("../controllers/adminStudentController")

const router = express.Router()

router.get(
  "/",
  protect,
  adminOnly,
  getStudents
)

router.put(
  "/:studentId",
  protect,
  adminOnly,
  updateStudent
)

router.put(
  "/:studentId/status",
  protect,
  adminOnly,
  updateStudentStatus
)

router.delete(
  "/:studentId",
  protect,
  adminOnly,
  deleteStudent
)

module.exports = router