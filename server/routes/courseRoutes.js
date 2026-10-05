const express = require("express")

const {
  getAllCourses,
  getCourseById
} = require("../controllers/courseController")

const router = express.Router()

router.get(
  "/",
  getAllCourses
)

router.get(
  "/:courseId",
  getCourseById
)

module.exports = router