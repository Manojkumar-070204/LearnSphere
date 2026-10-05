const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const instructorOnly =
  require("../middleware/instructorMiddleware")

const {
  getInstructorProfile,
  updateInstructorProfile
} = require("../controllers/instructorProfileController")

const router = express.Router()

router.get(
  "/",
  protect,
  instructorOnly,
  getInstructorProfile
)

router.put(
  "/",
  protect,
  instructorOnly,
  updateInstructorProfile
)

module.exports = router