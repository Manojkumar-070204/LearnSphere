const LearningProgress =
  require("../models/LearningProgress")

const Enrollment =
  require("../models/Enrollment")

const checkApprovedEnrollment = async (
  userId,
  courseId
) => {
  const enrollment =
    await Enrollment.findOne({
      user: userId,
      courseId,
      status: {
        $in: ["approved", "completed"]
      }
    })

  return enrollment
}

const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params

    const enrollment =
      await checkApprovedEnrollment(
        req.user.id,
        courseId
      )

    if (!enrollment) {
      return res.status(403).json({
        message:
          "Course access is pending admin approval."
      })
    }

    let progress =
      await LearningProgress.findOne({
        user: req.user.id,
        courseId
      })

    if (!progress) {
      progress =
        await LearningProgress.create({
          user: req.user.id,
          courseId,
          currentLesson: 0,
          currentPosition: 0,
          completedLessons: []
        })
    }

    res.status(200).json({
      progress
    })
  } catch (error) {
    console.error(
      "Get progress error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to fetch learning progress."
    })
  }
}

const updateProgress = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params

    const enrollment =
      await checkApprovedEnrollment(
        req.user.id,
        courseId
      )

    if (!enrollment) {
      return res.status(403).json({
        message:
          "Course access is pending admin approval."
      })
    }

    const {
      currentLesson,
      currentPosition,
      completedLessons
    } = req.body

    const progress =
      await LearningProgress.findOneAndUpdate(
        {
          user: req.user.id,
          courseId
        },
        {
          currentLesson:
            Number.isInteger(currentLesson)
              ? currentLesson
              : 0,

          currentPosition:
            typeof currentPosition === "number"
              ? Math.max(0, currentPosition)
              : 0,

          completedLessons:
            Array.isArray(completedLessons)
              ? completedLessons
              : []
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      )

    res.status(200).json({
      message:
        "Learning progress saved.",
      progress
    })
  } catch (error) {
    console.error(
      "Update progress error:",
      error
    )

    res.status(500).json({
      message:
        "Unable to save learning progress."
    })
  }
}

module.exports = {
  getProgress,
  updateProgress
}