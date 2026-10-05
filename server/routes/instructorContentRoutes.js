const express = require("express")

const protect =
  require("../middleware/authMiddleware")

const instructorOnly =
  require("../middleware/instructorMiddleware")

const {
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson
} = require("../controllers/instructorContentController")

const router = express.Router()

router.post(
  "/:courseId/modules",
  protect,
  instructorOnly,
  addModule
)

router.put(
  "/:courseId/modules/:moduleId",
  protect,
  instructorOnly,
  updateModule
)

router.delete(
  "/:courseId/modules/:moduleId",
  protect,
  instructorOnly,
  deleteModule
)

router.post(
  "/:courseId/modules/:moduleId/lessons",
  protect,
  instructorOnly,
  addLesson
)

router.put(
  "/:courseId/modules/:moduleId/lessons/:lessonId",
  protect,
  instructorOnly,
  updateLesson
)

router.delete(
  "/:courseId/modules/:moduleId/lessons/:lessonId",
  protect,
  instructorOnly,
  deleteLesson
)

module.exports = router