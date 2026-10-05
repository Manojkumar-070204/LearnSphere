import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const fallbackCourses = {
  mern: {
    title: "MERN Stack Development",
    instructor: "Arjun Sharma",
    category: "Web Development",
    duration: "45+ hours",
    totalLessons: 19
  },

  frontend: {
    title: "Frontend Development with React",
    instructor: "Ananya Rao",
    category: "Web Development",
    duration: "35+ hours",
    totalLessons: 17
  },

  datascience: {
    title: "Data Science with Python",
    instructor: "Rahul Mehta",
    category: "Data Science",
    duration: "40+ hours",
    totalLessons: 15
  },

  uiux: {
    title: "UI/UX Design Masterclass",
    instructor: "Priya Nair",
    category: "UI / UX Design",
    duration: "30+ hours",
    totalLessons: 13
  },

  ai: {
    title: "Artificial Intelligence Fundamentals",
    instructor: "Vikram Singh",
    category: "Artificial Intelligence",
    duration: "32+ hours",
    totalLessons: 13
  },

  cloud: {
    title: "Cloud & DevOps Engineering",
    instructor: "Karan Verma",
    category: "Cloud & DevOps",
    duration: "38+ hours",
    totalLessons: 13
  }
}

function getStoredUser() {
  const storedUser =
    localStorage.getItem(
      "learnsphereUser"
    )

  if (!storedUser) {
    return {}
  }

  try {
    return (
      JSON.parse(
        storedUser
      ) || {}
    )
  } catch {
    return {}
  }
}

function getInstructorName(course) {
  if (
    typeof course?.instructor ===
    "string"
  ) {
    return course.instructor
  }

  return (
    course?.instructor?.name ||
    "LearnSphere Instructor"
  )
}

function getTotalLessons(course) {
  if (
    typeof course?.totalLessons ===
    "number"
  ) {
    return course.totalLessons
  }

  if (
    !Array.isArray(course?.modules)
  ) {
    return 0
  }

  return course.modules.reduce(
    (total, module) =>
      total +
      (Array.isArray(
        module?.lessons
      )
        ? module.lessons.length
        : 0),
    0
  )
}

function formatDuration(course) {
  if (course?.duration) {
    return course.duration
  }

  return "—"
}

function Certificates() {
  const [course, setCourse] =
    useState(
      fallbackCourses.mern
    )

  const [isLoading, setIsLoading] =
    useState(true)

  const [isDownloading, setIsDownloading] =
    useState(false)

  const [isCompleted, setIsCompleted] =
    useState(false)

  const [completedLessons, setCompletedLessons] =
    useState(0)

  const [totalLessons, setTotalLessons] =
    useState(
      fallbackCourses.mern.totalLessons
    )

  const [progressDate, setProgressDate] =
    useState(null)

  const [error, setError] =
    useState("")

  const params = new URLSearchParams(
    window.location.search
  )

  const courseId =
    params.get("course") || "mern"

  const user =
    getStoredUser()

  const learnerName =
    user?.name &&
    user.name.trim()
      ? user.name.trim()
      : "Learner"

  const quizResult =
    localStorage.getItem(
      `learnsphereQuiz_${courseId}`
    )

  let quizPercentage = null
  let quizPassed = false

  if (quizResult) {
    try {
      const result =
        JSON.parse(
          quizResult
        )

      quizPercentage =
        result?.percentage ??
        null

      quizPassed =
        result?.passed === true
    } catch {
      quizPercentage = null
      quizPassed = false
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadCertificateData() {
      const token =
        localStorage.getItem(
          "learnsphereToken"
        )

      if (!token) {
        if (!cancelled) {
          setError(
            "Authentication required."
          )
          setIsLoading(false)
        }

        return
      }

      try {
        const [
          courseResponse,
          progressResponse
        ] = await Promise.all([
          fetch(
            `http://localhost:5000/api/courses/${encodeURIComponent(
              courseId
            )}`
          ),

          fetch(
            `http://localhost:5000/api/progress/${encodeURIComponent(
              courseId
            )}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )
        ])

        const courseData =
          await courseResponse.json()

        const progressData =
          await progressResponse.json()

        if (!courseResponse.ok) {
          throw new Error(
            courseData.message ||
              "Unable to load course."
          )
        }

        if (!progressResponse.ok) {
          throw new Error(
            progressData.message ||
              "Unable to load course progress."
          )
        }

        if (cancelled) {
          return
        }

        const backendCourse =
          courseData?.course ||
          courseData

        const fallbackCourse =
          fallbackCourses[courseId]

        const mergedCourse = {
          ...(fallbackCourse || {}),
          ...(backendCourse || {})
        }

        const lessonsCount =
          getTotalLessons(
            mergedCourse
          )

        const completed =
          Array.isArray(
            progressData?.progress
              ?.completedLessons
          )
            ? progressData.progress
                .completedLessons.length
            : 0

        const fullyCompleted =
          lessonsCount > 0 &&
          completed >=
            lessonsCount

        setCourse(
          mergedCourse
        )

        setTotalLessons(
          lessonsCount
        )

        setCompletedLessons(
          completed
        )

        setIsCompleted(
          fullyCompleted
        )

        setProgressDate(
          progressData?.progress
            ?.updatedAt ||
            null
        )

        setError("")
      } catch (loadError) {
        console.error(
          "Certificate loading error:",
          loadError
        )

        if (!cancelled) {
          const fallbackCourse =
            fallbackCourses[
              courseId
            ] ||
            fallbackCourses.mern

          setCourse(
            fallbackCourse
          )

          setTotalLessons(
            getTotalLessons(
              fallbackCourse
            )
          )

          setCompletedLessons(
            0
          )

          setIsCompleted(
            false
          )

          setError(
            loadError.message ||
              "Unable to load certificate information."
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadCertificateData()

    return () => {
      cancelled = true
    }
  }, [courseId])

  const completionDate =
    progressDate
      ? new Date(
          progressDate
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric"
          }
        )
      : new Date().toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric"
          }
        )

  const certificateId =
    `LS-${courseId
      .toUpperCase()
      .replace(
        /[^A-Z0-9]/g,
        ""
      )}-${String(
      totalLessons
    ).padStart(
      2,
      "0"
    )}`

  function handleDownload() {
    setIsDownloading(true)

    setTimeout(() => {
      window.print()
      setIsDownloading(false)
    }, 300)
  }

  function goToDashboard() {
    window.location.assign(
      "/dashboard"
    )
  }

  function goToLearning() {
    window.location.assign(
      `/learning?course=${encodeURIComponent(
        courseId
      )}`
    )
  }

  const instructor =
    getInstructorName(
      course
    )

  const courseTitle =
    course?.title ||
    courseId

  const category =
    course?.category ||
    "Course"

  const duration =
    formatDuration(
      course
    )

  if (isLoading) {
    return (
      <>
        <Navbar />

        <main className="certificate-page">

          <section className="certificate-workspace">

            <div className="certificate-status">

              <div className="certificate-status-content">

                <strong>
                  Checking course completion...
                </strong>

                <span>
                  Please wait while we verify
                  your learning progress.
                </span>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  if (!isCompleted) {
    return (
      <>
        <Navbar />

        <main className="certificate-page">

          <section className="certificate-header">

            <div className="certificate-header-container">

              <div className="certificate-header-content">

                <span className="certificate-eyebrow">
                  LEARNSPHERE CERTIFICATE
                </span>

                <h1>
                  Certificate Not Available Yet
                </h1>

                <p>
                  Complete all {totalLessons} lessons
                  in this course to earn your
                  certificate of completion.
                </p>

              </div>

              <div className="certificate-header-actions">

                <button
                  type="button"
                  className="certificate-secondary-btn"
                  onClick={
                    goToLearning
                  }
                >
                  Back to Learning
                </button>

                <button
                  type="button"
                  className="certificate-primary-btn"
                  onClick={
                    goToDashboard
                  }
                >
                  Go to Dashboard
                </button>

              </div>

            </div>

          </section>

          <section className="certificate-workspace">

            {error && (
              <div className="certificate-status">

                <div className="certificate-status-icon">
                  !
                </div>

                <div className="certificate-status-content">

                  <strong>
                    Unable to verify completion
                  </strong>

                  <span>
                    {error}
                  </span>

                </div>

              </div>
            )}

            {!error && (
              <div className="certificate-status">

                <div className="certificate-status-icon">
                  !
                </div>

                <div className="certificate-status-content">

                  <strong>
                    Course Incomplete
                  </strong>

                  <span>
                    {completedLessons} of{" "}
                    {totalLessons} lessons
                    completed.
                  </span>

                </div>

              </div>
            )}

            <div className="certificate-info-grid">

              <div className="certificate-info-card">

                <span>
                  Course
                </span>

                <strong>
                  {courseTitle}
                </strong>

              </div>

              <div className="certificate-info-card">

                <span>
                  Category
                </span>

                <strong>
                  {category}
                </strong>

              </div>

              <div className="certificate-info-card">

                <span>
                  Instructor
                </span>

                <strong>
                  {instructor}
                </strong>

              </div>

              <div className="certificate-info-card">

                <span>
                  Progress
                </span>

                <strong>
                  {completedLessons} /{" "}
                  {totalLessons}
                </strong>

              </div>

            </div>

            <div className="certificate-actions">

              <button
                type="button"
                className="certificate-dashboard-btn"
                onClick={
                  goToDashboard
                }
              >
                Go to Dashboard
              </button>

              <button
                type="button"
                className="certificate-learning-btn"
                onClick={
                  goToLearning
                }
              >
                Continue Learning
              </button>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="certificate-page">

        <section className="certificate-header">

          <div className="certificate-header-container">

            <div className="certificate-header-content">

              <span className="certificate-eyebrow">
                LEARNSPHERE CERTIFICATE
              </span>

              <h1>
                Congratulations,{" "}
                {learnerName}
              </h1>

              <p>
                You have successfully completed
                your learning journey and earned a
                certificate of completion.
              </p>

            </div>

            <div className="certificate-header-actions">

              <button
                type="button"
                className="certificate-secondary-btn"
                onClick={
                  goToLearning
                }
              >
                Back to Learning
              </button>

              <button
                type="button"
                className="certificate-primary-btn"
                onClick={
                  handleDownload
                }
              >
                {isDownloading
                  ? "Preparing..."
                  : "Download Certificate"}
              </button>

            </div>

          </div>

        </section>

        <section className="certificate-workspace">

          <div className="certificate-status">

            <div className="certificate-status-icon">
              ✓
            </div>

            <div className="certificate-status-content">

              <strong>
                Course Completed
              </strong>

              <span>
                {quizPassed &&
                quizPercentage !== null
                  ? `Course completed successfully. Quiz score: ${quizPercentage}%`
                  : "Course completed successfully."}
              </span>

            </div>

          </div>

          <div className="certificate-card">

            <div className="certificate-card-border">

              <div className="certificate-top">

                <div className="certificate-brand">
                  Learn<span>Sphere</span>
                </div>

                <div className="certificate-mark">
                  LS
                </div>

              </div>

              <div className="certificate-main">

                <span className="certificate-small-title">
                  CERTIFICATE OF COMPLETION
                </span>

                <h2>
                  Certificate of Achievement
                </h2>

                <p className="certificate-presented">
                  This certificate is proudly
                  presented to
                </p>

                <h3 className="certificate-name">
                  {learnerName}
                </h3>

                <div className="certificate-line"></div>

                <p className="certificate-description">
                  For successfully completing the
                </p>

                <h4 className="certificate-course">
                  {courseTitle}
                </h4>

                <p className="certificate-description">
                  on LearnSphere, demonstrating
                  commitment to continuous learning
                  and professional development.
                </p>

                <div className="certificate-details">

                  <div>

                    <span>
                      INSTRUCTOR
                    </span>

                    <strong>
                      {instructor}
                    </strong>

                  </div>

                  <div>

                    <span>
                      COMPLETED ON
                    </span>

                    <strong>
                      {completionDate}
                    </strong>

                  </div>

                  <div>

                    <span>
                      DURATION
                    </span>

                    <strong>
                      {duration}
                    </strong>

                  </div>

                </div>

              </div>

              <div className="certificate-bottom">

                <div className="certificate-signature">

                  <strong>
                    {instructor}
                  </strong>

                  <span>
                    Course Instructor
                  </span>

                </div>

                <div className="certificate-seal">

                  <span>
                    ✓
                  </span>

                  <small>
                    VERIFIED
                  </small>

                </div>

                <div className="certificate-id">

                  <span>
                    CERTIFICATE ID
                  </span>

                  <strong>
                    {certificateId}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          <div className="certificate-info-grid">

            <div className="certificate-info-card">

              <span>
                Course
              </span>

              <strong>
                {courseTitle}
              </strong>

            </div>

            <div className="certificate-info-card">

              <span>
                Category
              </span>

              <strong>
                {category}
              </strong>

            </div>

            <div className="certificate-info-card">

              <span>
                Instructor
              </span>

              <strong>
                {instructor}
              </strong>

            </div>

            <div className="certificate-info-card">

              <span>
                Status
              </span>

              <strong className="certificate-completed">
                Completed
              </strong>

            </div>

          </div>

          <div className="certificate-actions">

            <button
              type="button"
              className="certificate-dashboard-btn"
              onClick={
                goToDashboard
              }
            >
              Go to Dashboard
            </button>

            <button
              type="button"
              className="certificate-learning-btn"
              onClick={
                goToLearning
              }
            >
              Continue Learning
            </button>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Certificates