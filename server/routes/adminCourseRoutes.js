const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const adminOnly =
  require("../middleware/adminMiddleware")

const {
  getAdminCourses,
  updateAdminCourse,
  deleteAdminCourse
} = require("../controllers/adminCourseController")

const router = express.Router()

router.get(
  "/",
  protect,
  adminOnly,
  getAdminCourses
)

router.put(
  "/:courseId",
  protect,
  adminOnly,
  updateAdminCourse
)

router.delete(
  "/:courseId",
  protect,
  adminOnly,
  deleteAdminCourse
)

module.exports = router