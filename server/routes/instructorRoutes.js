const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddleware")
const instructorOnly = require("../middleware/instructorMiddleware")

const {
  getInstructorDashboard,
  addCourse,
  updateCourse,
  updateCourseContent,
  deleteCourse
} = require("../controllers/instructorController")

router.get(
  "/dashboard",
  protect,
  instructorOnly,
  getInstructorDashboard
)

router.post(
  "/courses",
  protect,
  instructorOnly,
  addCourse
)

router.put(
  "/courses/:courseId",
  protect,
  instructorOnly,
  updateCourse
)

router.put(
  "/courses/:courseId/content",
  protect,
  instructorOnly,
  updateCourseContent
)

router.delete(
  "/courses/:courseId",
  protect,
  instructorOnly,
  deleteCourse
)

module.exports = router