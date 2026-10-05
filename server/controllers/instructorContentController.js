const Course = require("../models/Course")

const findInstructorCourse = async (
  courseId,
  instructorId
) => {
  return Course.findOne({
    courseId,
    instructor: instructorId
  })
}

const addModule = async (
  req,
  res
) => {
  try {
    const { courseId } =
      req.params

    const { title } =
      req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message:
          "Module title is required."
      })
    }

    const course =
      await findInstructorCourse(
        courseId,
        req.user.id
      )

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    course.modules.push({
      title: title.trim(),
      lessons: []
    })

    await course.save()

    const module =
      course.modules[
        course.modules.length - 1
      ]

    res.status(201).json({
      message:
        "Module added successfully.",
      module
    })
  } catch (error) {
    console.error(
      "Add module error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to add module."
    })
  }
}

const updateModule = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      moduleId
    } = req.params

    const { title } =
      req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message:
          "Module title is required."
      })
    }

    const course =
      await findInstructorCourse(
        courseId,
        req.user.id
      )

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    const module =
      course.modules.id(
        moduleId
      )

    if (!module) {
      return res.status(404).json({
        message:
          "Module not found."
      })
    }

    module.title =
      title.trim()

    await course.save()

    res.status(200).json({
      message:
        "Module updated successfully.",
      module
    })
  } catch (error) {
    console.error(
      "Update module error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update module."
    })
  }
}

const deleteModule = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      moduleId
    } = req.params

    const course =
      await findInstructorCourse(
        courseId,
        req.user.id
      )

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    const module =
      course.modules.id(
        moduleId
      )

    if (!module) {
      return res.status(404).json({
        message:
          "Module not found."
      })
    }

    module.deleteOne()

    await course.save()

    res.status(200).json({
      message:
        "Module deleted successfully."
    })
  } catch (error) {
    console.error(
      "Delete module error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete module."
    })
  }
}

const addLesson = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      moduleId
    } = req.params

    const {
      title,
      videoId
    } = req.body

    if (
      !title ||
      !title.trim() ||
      !videoId ||
      !videoId.trim()
    ) {
      return res.status(400).json({
        message:
          "Lesson title and YouTube video ID are required."
      })
    }

    const course =
      await findInstructorCourse(
        courseId,
        req.user.id
      )

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    const module =
      course.modules.id(
        moduleId
      )

    if (!module) {
      return res.status(404).json({
        message:
          "Module not found."
      })
    }

    module.lessons.push({
      title: title.trim(),
      videoId: videoId.trim()
    })

    await course.save()

    const lesson =
      module.lessons[
        module.lessons.length - 1
      ]

    res.status(201).json({
      message:
        "Lesson added successfully.",
      lesson
    })
  } catch (error) {
    console.error(
      "Add lesson error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to add lesson."
    })
  }
}

const updateLesson = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      moduleId,
      lessonId
    } = req.params

    const {
      title,
      videoId
    } = req.body

    if (
      !title ||
      !title.trim() ||
      !videoId ||
      !videoId.trim()
    ) {
      return res.status(400).json({
        message:
          "Lesson title and YouTube video ID are required."
      })
    }

    const course =
      await findInstructorCourse(
        courseId,
        req.user.id
      )

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    const module =
      course.modules.id(
        moduleId
      )

    if (!module) {
      return res.status(404).json({
        message:
          "Module not found."
      })
    }

    const lesson =
      module.lessons.id(
        lessonId
      )

    if (!lesson) {
      return res.status(404).json({
        message:
          "Lesson not found."
      })
    }

    lesson.title =
      title.trim()

    lesson.videoId =
      videoId.trim()

    await course.save()

    res.status(200).json({
      message:
        "Lesson updated successfully.",
      lesson
    })
  } catch (error) {
    console.error(
      "Update lesson error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update lesson."
    })
  }
}

const deleteLesson = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      moduleId,
      lessonId
    } = req.params

    const course =
      await findInstructorCourse(
        courseId,
        req.user.id
      )

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    const module =
      course.modules.id(
        moduleId
      )

    if (!module) {
      return res.status(404).json({
        message:
          "Module not found."
      })
    }

    const lesson =
      module.lessons.id(
        lessonId
      )

    if (!lesson) {
      return res.status(404).json({
        message:
          "Lesson not found."
      })
    }

    lesson.deleteOne()

    await course.save()

    res.status(200).json({
      message:
        "Lesson deleted successfully."
    })
  } catch (error) {
    console.error(
      "Delete lesson error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete lesson."
    })
  }
}

module.exports = {
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson
}