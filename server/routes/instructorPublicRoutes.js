const express = require("express")

const {
  getPublicInstructors,
  getPublicInstructorById
} = require("../controllers/instructorPublicController")

const router = express.Router()

router.get(
  "/",
  getPublicInstructors
)

router.get(
  "/:instructorId",
  getPublicInstructorById
)

module.exports = router