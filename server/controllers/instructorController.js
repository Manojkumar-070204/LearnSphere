const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")
const LearningProgress = require("../models/LearningProgress")

const getInstructorDashboard = async (
  req,
  res
) => {
  try {
    const instructorId = req.user.id

    const courses =
      await Course.find({
        instructor: instructorId
      })
        .select(
          "courseId title description category price duration image modules"
        )
        .lean()

    const courseIds =
      courses.map(
        (course) =>
          course.courseId
      )

    const totalEnrollments =
      await Enrollment.countDocuments({
        courseId: {
          $in: courseIds
        }
      })

    res.status(200).json({
      message:
        "Instructor dashboard loaded successfully.",
      instructorId,
      totalCourses:
        courses.length,
      totalEnrollments,
      courses
    })
  } catch (error) {
    console.error(
      "Instructor dashboard error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to load instructor dashboard."
    })
  }
}

const addCourse = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      title,
      description,
      category,
      price,
      duration,
      image,
      modules
    } = req.body

    if (
      !courseId ||
      !title ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Course ID, title and price are required."
      })
    }

    const numericPrice =
      Number(price)

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        message:
          "Price must be a valid non-negative number."
      })
    }

    const existingCourse =
      await Course.findOne({
        courseId:
          courseId.trim()
      })

    if (existingCourse) {
      return res.status(400).json({
        message:
          "Course ID already exists."
      })
    }

    const course =
      await Course.create({
        courseId:
          courseId.trim(),

        title:
          title.trim(),

        description:
          description || "",

        category:
          category || "",

        instructor:
          req.user.id,

        price:
          numericPrice,

        duration:
          duration || "",

        image:
          image || "",

        modules:
          Array.isArray(modules)
            ? modules
            : []
      })

    res.status(201).json({
      message:
        "Course created successfully.",
      course
    })
  } catch (error) {
    console.error(
      "Add course error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to create course."
    })
  }
}

const updateCourse = async (
  req,
  res
) => {
  try {
    const { courseId } =
      req.params

    const {
      title,
      description,
      category,
      price,
      duration,
      image
    } = req.body

    const course =
      await Course.findOne({
        courseId,
        instructor:
          req.user.id
      })

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message:
            "Course title cannot be empty."
        })
      }

      course.title =
        title.trim()
    }

    if (
      description !== undefined
    ) {
      course.description =
        description
    }

    if (category !== undefined) {
      course.category =
        category
    }

    if (price !== undefined) {
      const numericPrice =
        Number(price)

      if (
        Number.isNaN(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          message:
            "Price must be a valid non-negative number."
        })
      }

      course.price =
        numericPrice
    }

    if (duration !== undefined) {
      course.duration =
        duration
    }

    if (image !== undefined) {
      course.image =
        image
    }

    await course.save()

    res.status(200).json({
      message:
        "Course updated successfully.",
      course
    })
  } catch (error) {
    console.error(
      "Update course error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to update course."
    })
  }
}

const updateCourseContent = async (
  req,
  res
) => {
  try {
    const { courseId } =
      req.params

    const { modules } =
      req.body

    if (!Array.isArray(modules)) {
      return res.status(400).json({
        message:
          "Modules must be an array."
      })
    }

    const cleanedModules =
      modules.map(
        (module) => {
          if (
            !module ||
            typeof module !==
              "object"
          ) {
            throw new Error(
              "Each module must be an object."
            )
          }

          const moduleTitle =
            String(
              module.title || ""
            ).trim()

          if (!moduleTitle) {
            throw new Error(
              "Each module must have a title."
            )
          }

          const lessons =
            Array.isArray(
              module.lessons
            )
              ? module.lessons
              : []

          const cleanedLessons =
            lessons.map(
              (lesson) => {
                if (
                  !lesson ||
                  typeof lesson !==
                    "object"
                ) {
                  throw new Error(
                    "Each lesson must be an object."
                  )
                }

                const lessonTitle =
                  String(
                    lesson.title || ""
                  ).trim()

                const videoId =
                  String(
                    lesson.videoId || ""
                  ).trim()

                if (!lessonTitle) {
                  throw new Error(
                    "Each lesson must have a title."
                  )
                }

                if (!videoId) {
                  throw new Error(
                    "Each lesson must have a YouTube video ID."
                  )
                }

                return {
                  ...(lesson._id
                    ? {
                        _id:
                          lesson._id
                      }
                    : {}),

                  title:
                    lessonTitle,

                  videoId
                }
              }
            )

          return {
            ...(module._id
              ? {
                  _id:
                    module._id
                }
              : {}),

            title:
              moduleTitle,

            lessons:
              cleanedLessons
          }
        }
      )

    const course =
      await Course.findOne({
        courseId,
        instructor:
          req.user.id
      })

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    course.modules =
      cleanedModules

    await course.save()

    res.status(200).json({
      message:
        "Course content updated successfully.",
      course
    })
  } catch (error) {
    console.error(
      "Update course content error:",
      error
    )

    res.status(400).json({
      message:
        error.message ||
        "Failed to update course content."
    })
  }
}

const deleteCourse = async (
  req,
  res
) => {
  try {
    const { courseId } =
      req.params

    const course =
      await Course.findOne({
        courseId,
        instructor:
          req.user.id
      })

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found."
      })
    }

    await LearningProgress.deleteMany({
      courseId
    })

    await Enrollment.deleteMany({
      courseId
    })

    await Course.deleteOne({
      _id: course._id
    })

    res.status(200).json({
      message:
        "Course and related enrollment data deleted successfully."
    })
  } catch (error) {
    console.error(
      "Delete course error:",
      error
    )

    res.status(500).json({
      message:
        "Failed to delete course."
    })
  }
}

module.exports = {
  getInstructorDashboard,
  addCourse,
  updateCourse,
  updateCourseContent,
  deleteCourse
}