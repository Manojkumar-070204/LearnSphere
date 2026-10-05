const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const instructorOnly =
  require("../middleware/instructorMiddleware")

const {
  getInstructorStudents,
  getInstructorStudent
} = require("../controllers/instructorStudentController")

const router = express.Router()

router.get(
  "/",
  protect,
  instructorOnly,
  getInstructorStudents
)

router.get(
  "/:studentId",
  protect,
  instructorOnly,
  getInstructorStudent
)

module.exports = router