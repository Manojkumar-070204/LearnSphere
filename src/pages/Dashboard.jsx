import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function getStoredUser() {
  const storedUser =
    localStorage.getItem(
      "learnsphereUser"
    )

  if (!storedUser) {
    return {
      name: "Learner",
      email: ""
    }
  }

  try {
    const parsedUser =
      JSON.parse(storedUser)

    return {
      name:
        parsedUser?.name ||
        "Learner",
      email:
        parsedUser?.email ||
        ""
    }
  } catch {
    return {
      name: "Learner",
      email: ""
    }
  }
}

function getCourseId(course) {
  return (
    course?.courseId ||
    course?._id ||
    course?.id ||
    ""
  )
}

function getCourseInstructor(course) {
  if (
    typeof course?.instructor ===
    "string"
  ) {
    return course.instructor
  }

  return (
    course?.instructor?.name ||
    course?.instructor?.fullName ||
    "LearnSphere Instructor"
  )
}

function getTotalLessons(course) {
  if (
    !Array.isArray(course?.modules)
  ) {
    return 0
  }

  return course.modules.reduce(
    (total, module) => {
      const lessons =
        Array.isArray(
          module?.lessons
        )
          ? module.lessons
          : []

      return (
        total +
        lessons.length
      )
    },
    0
  )
}

function Dashboard() {
  const [enrolledCourseData, setEnrolledCourseData] =
    useState([])

  const [quizResults, setQuizResults] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const user =
    getStoredUser()

  useEffect(() => {
    let cancelled = false

    const token =
      localStorage.getItem(
        "learnsphereToken"
      )

    if (!token) {
      window.location.assign(
        "/login"
      )
      return () => {
        cancelled = true
      }
    }

    async function loadDashboard() {
      try {
        setLoading(true)
        setError("")

        const [
          dashboardResponse,
          coursesResponse
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/dashboard/student",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          ),

          fetch(
            "http://localhost:5000/api/courses"
          )
        ])

        const dashboardData =
          await dashboardResponse.json()

        const coursesData =
          await coursesResponse.json()

        if (!dashboardResponse.ok) {
          throw new Error(
            dashboardData.message ||
              "Unable to load dashboard data."
          )
        }

        if (!coursesResponse.ok) {
          throw new Error(
            coursesData.message ||
              "Unable to load course data."
          )
        }

        if (cancelled) {
          return
        }

        const dashboardCourses =
          Array.isArray(
            dashboardData?.courses
          )
            ? dashboardData.courses
            : []

        const availableCourses =
          Array.isArray(
            coursesData
          )
            ? coursesData
            : Array.isArray(
                coursesData?.courses
              )
              ? coursesData.courses
              : []

        const courseMap = {}

        availableCourses.forEach(
          (course) => {
            const courseId =
              getCourseId(
                course
              )

            if (courseId) {
              courseMap[
                courseId
              ] = course
            }
          }
        )

        const mappedCourses =
          dashboardCourses
            .map(
              (
                dashboardCourse
              ) => {
                const courseId =
                  dashboardCourse.courseId

                const course =
                  courseMap[
                    courseId
                  ]

                if (!course) {
                  return {
                    id: courseId,
                    title:
                      courseId,
                    category:
                      "Course",
                    instructor:
                      "LearnSphere Instructor",
                    duration:
                      "—",
                    totalLessons:
                      0,
                    completedLessonCount:
                      Array.isArray(
                        dashboardCourse.completedLessons
                      )
                        ? dashboardCourse
                            .completedLessons
                            .length
                        : 0,
                    progress: 0,
                    currentLesson:
                      Number(
                        dashboardCourse.currentLesson
                      ) || 0,
                    currentPosition:
                      Number(
                        dashboardCourse.currentPosition
                      ) || 0,
                    completedLessons:
                      Array.isArray(
                        dashboardCourse.completedLessons
                      )
                        ? dashboardCourse.completedLessons
                        : [],
                    enrollmentStatus:
                      dashboardCourse.enrollmentStatus ||
                      "pending",
                    paymentStatus:
                      dashboardCourse.paymentStatus ||
                      "",
                    paymentId:
                      dashboardCourse.paymentId ||
                      "",
                    orderId:
                      dashboardCourse.orderId ||
                      "",
                    enrolledAt:
                      dashboardCourse.enrolledAt
                  }
                }

                const totalLessons =
                  getTotalLessons(
                    course
                  )

                const completedLessons =
                  Array.isArray(
                    dashboardCourse.completedLessons
                  )
                    ? dashboardCourse.completedLessons
                    : []

                const completedLessonCount =
                  completedLessons.length

                const progress =
                  totalLessons > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (
                            completedLessonCount /
                            totalLessons
                          ) *
                          100
                        )
                      )
                    : 0

                return {
                  id:
                    courseId,

                  ...course,

                  totalLessons,

                  completedLessonCount,

                  progress,

                  currentLesson:
                    Number(
                      dashboardCourse.currentLesson
                    ) || 0,

                  currentPosition:
                    Number(
                      dashboardCourse.currentPosition
                    ) || 0,

                  completedLessons,

                  enrollmentStatus:
                    dashboardCourse.enrollmentStatus ||
                    "pending",

                  paymentStatus:
                    dashboardCourse.paymentStatus ||
                    "",

                  paymentId:
                    dashboardCourse.paymentId ||
                    "",

                  orderId:
                    dashboardCourse.orderId ||
                    "",

                  enrolledAt:
                    dashboardCourse.enrolledAt
                }
              }
            )
            .filter(Boolean)

        const results =
          mappedCourses
            .map((course) => {
              const savedResult =
                localStorage.getItem(
                  `learnsphereQuiz_${course.id}`
                )

              if (!savedResult) {
                return null
              }

              try {
                const result =
                  JSON.parse(
                    savedResult
                  )

                return {
                  courseId:
                    course.id,

                  courseTitle:
                    course.title ||
                    course.id,

                  category:
                    course.category ||
                    "Assessment",

                  ...result
                }
              } catch {
                return null
              }
            })
            .filter(Boolean)

        setEnrolledCourseData(
          mappedCourses
        )

        setQuizResults(
          results
        )
      } catch (dashboardError) {
        console.error(
          "Dashboard loading error:",
          dashboardError
        )

        if (!cancelled) {
          setEnrolledCourseData(
            []
          )

          setQuizResults(
            []

          )

          setError(
            dashboardError.message ||
              "Unable to load dashboard."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const courseProgress =
    enrolledCourseData

  const completedCourses =
    courseProgress.filter(
      (course) =>
        course.progress === 100
    ).length

  const passedQuizzes =
    quizResults.filter(
      (result) =>
        result.passed === true
    )

  const certificateCount =
    passedQuizzes.length

  const quizAverage =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce(
            (
              total,
              result
            ) =>
              total +
              Number(
                result.percentage ||
                  0
              ),
            0
          ) /
            quizResults.length
        )
      : 0

  const overallProgress =
    courseProgress.length > 0
      ? Math.round(
          courseProgress.reduce(
            (
              total,
              course
            ) =>
              total +
              Number(
                course.progress ||
                  0
              ),
            0
          ) /
            courseProgress.length
        )
      : 0

  function continueLearning(
    courseId
  ) {
    window.location.assign(
      `/learning?course=${encodeURIComponent(
        courseId
      )}`
    )
  }

  function browseCourses() {
    window.location.assign(
      "/courses"
    )
  }

  function viewCertificates() {
    if (
      certificateCount > 0
    ) {
      const firstCertificate =
        passedQuizzes[0]

      window.location.assign(
        `/certificates?course=${encodeURIComponent(
          firstCertificate.courseId
        )}`
      )

      return
    }

    window.location.assign(
      "/certificates"
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="dashboard-page">

          <section className="dashboard-hero">

            <div className="dashboard-container">

              <div className="dashboard-hero-content">

                <span className="dashboard-eyebrow">
                  LEARNING DASHBOARD
                </span>

                <h1>
                  Loading your{" "}
                  <strong>
                    dashboard
                  </strong>
                </h1>

                <p>
                  Loading your courses and
                  learning progress.
                </p>

              </div>

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

      <main className="dashboard-page">

        <section className="dashboard-hero">

          <div className="dashboard-container">

            <div className="dashboard-hero-content">

              <span className="dashboard-eyebrow">
                LEARNING DASHBOARD
              </span>

              <h1>
                Welcome back,{" "}
                <strong>
                  {user.name}
                </strong>
              </h1>

              <p>
                Continue your learning journey
                and keep building skills that move
                your career forward.
              </p>

            </div>

            <div className="dashboard-user-card">

              <div className="dashboard-user-avatar">

                {user.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "L"}

              </div>

              <div>

                <strong>
                  {user.name}
                </strong>

                <span>
                  {user.email}
                </span>

              </div>

            </div>

          </div>

        </section>

        {error && (
          <section className="dashboard-section">

            <div className="dashboard-container">

              <div className="dashboard-no-results">

                <h3>
                  Unable to load some dashboard data
                </h3>

                <p>
                  {error}
                </p>

              </div>

            </div>

          </section>
        )}

        <section className="dashboard-section">

          <div className="dashboard-container">

            <div className="dashboard-section-heading">

              <div>

                <span>
                  OVERVIEW
                </span>

                <h2>
                  Your learning progress
                </h2>

              </div>

            </div>

            <div className="dashboard-stats">

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  01
                </div>

                <div>

                  <strong>
                    {courseProgress.length}
                  </strong>

                  <span>
                    Enrolled Courses
                  </span>

                </div>

              </div>

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  02
                </div>

                <div>

                  <strong>
                    {completedCourses}
                  </strong>

                  <span>
                    Completed Courses
                  </span>

                </div>

              </div>

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  03
                </div>

                <div>

                  <strong>
                    {certificateCount}
                  </strong>

                  <span>
                    Certificates
                  </span>

                </div>

              </div>

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  04
                </div>

                <div>

                  <strong>
                    {quizAverage}%
                  </strong>

                  <span>
                    Quiz Average
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="dashboard-learning-section">

          <div className="dashboard-container">

            <div className="dashboard-main-grid">

              <div className="dashboard-learning">

                <div className="dashboard-section-heading">

                  <div>

                    <span>
                      MY LEARNING
                    </span>

                    <h2>
                      Continue Learning
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={
                      browseCourses
                    }
                    className="dashboard-text-button"
                  >
                    Browse Courses →
                  </button>

                </div>

                {courseProgress.length ===
                0 ? (
                  <div className="dashboard-empty-card">

                    <div className="dashboard-empty-number">
                      01
                    </div>

                    <h3>
                      Your learning journey
                      starts here.
                    </h3>

                    <p>
                      Explore our courses and
                      enroll in a program that
                      matches your career goals.
                    </p>

                    <button
                      type="button"
                      onClick={
                        browseCourses
                      }
                      className="dashboard-primary-button"
                    >
                      Explore Courses
                    </button>

                  </div>
                ) : (
                  <div className="dashboard-course-list">

                    {courseProgress.map(
                      (
                        course,
                        index
                      ) => (

                        <div
                          className="dashboard-course-card"
                          key={
                            course.id ||
                            index
                          }
                        >

                          <div className="dashboard-course-number">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div className="dashboard-course-content">

                            <div className="dashboard-course-top">

                              <span>
                                {course.category ||
                                  "Course"}
                              </span>

                              <small>
                                {course.enrollmentStatus ===
                                "pending"
                                  ? "Pending Approval"
                                  : course.progress ===
                                      100
                                    ? "Completed"
                                    : `${course.progress}% Complete`}
                              </small>

                            </div>

                            <h3>
                              {course.title ||
                                course.id}
                            </h3>

                            <p>
                              Instructor:{" "}
                              {getCourseInstructor(
                                course
                              )}
                            </p>

                            <div className="dashboard-course-progress">

                              <div className="dashboard-progress-header">

                                <span>
                                  {course.progress}%
                                  {" "}
                                  completed
                                </span>

                                <span>
                                  {course.duration ||
                                    "—"}
                                </span>

                              </div>

                              <div className="dashboard-progress-bar">

                                <div
                                  style={{
                                    width: `${course.progress}%`
                                  }}
                                ></div>

                              </div>

                            </div>

                            {course.enrollmentStatus ===
                              "pending" && (
                              <p
                                style={{
                                  marginTop:
                                    "8px"
                                }}
                              >
                                Waiting for admin
                                approval before
                                learning access is
                                enabled.
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              continueLearning(
                                course.id
                              )
                            }
                            className="dashboard-course-button"
                            disabled={
                              course.enrollmentStatus ===
                              "pending"
                            }
                          >
                            {course.enrollmentStatus ===
                            "pending"
                              ? "Pending"
                              : course.progress ===
                                  100
                                ? "Review Course"
                                : "Continue"}
                          </button>

                        </div>

                      )
                    )}

                  </div>
                )}

              </div>

              <aside className="dashboard-sidebar">

                <div className="dashboard-action-card">

                  <span>
                    QUICK ACTIONS
                  </span>

                  <h3>
                    Keep your learning momentum.
                  </h3>

                  <button
                    type="button"
                    onClick={
                      browseCourses
                    }
                  >
                    Explore Courses
                    <span>
                      →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={
                      viewCertificates
                    }
                  >
                    View Certificates
                    <span>
                      →
                    </span>
                  </button>

                </div>

                <div className="dashboard-performance-card">

                  <span>
                    PERFORMANCE
                  </span>

                  <div className="dashboard-performance-value">
                    {quizAverage}%
                  </div>

                  <p>
                    Average score across completed
                    quizzes.
                  </p>

                  <div className="dashboard-performance-line">

                    <div
                      style={{
                        width: `${quizAverage}%`
                      }}
                    ></div>

                  </div>

                </div>

                <div className="dashboard-performance-card">

                  <span>
                    OVERALL PROGRESS
                  </span>

                  <div className="dashboard-performance-value">
                    {overallProgress}%
                  </div>

                  <p>
                    Average completion across
                    your enrolled courses.
                  </p>

                  <div className="dashboard-performance-line">

                    <div
                      style={{
                        width: `${overallProgress}%`
                      }}
                    ></div>

                  </div>

                </div>

              </aside>

            </div>

          </div>

        </section>

        <section className="dashboard-quiz-section">

          <div className="dashboard-container">

            <div className="dashboard-section-heading">

              <div>

                <span>
                  ASSESSMENTS
                </span>

                <h2>
                  Recent Quiz Results
                </h2>

              </div>

            </div>

            {quizResults.length ===
            0 ? (
              <div className="dashboard-no-results">

                <h3>
                  No quiz results yet
                </h3>

                <p>
                  Complete a course assessment
                  to see your performance here.
                </p>

              </div>
            ) : (
              <div className="dashboard-results-grid">

                {quizResults.map(
                  (result) => (

                    <div
                      className="dashboard-result-card"
                      key={
                        result.courseId
                      }
                    >

                      <div className="dashboard-result-header">

                        <span>
                          {result.category ||
                            "Assessment"}
                        </span>

                        <strong>
                          {Number(
                            result.percentage ||
                              0
                          )}%
                        </strong>

                      </div>

                      <h3>
                        {result.courseTitle ||
                          result.courseId}
                      </h3>

                      <p>
                        {result.score !==
                          undefined &&
                        result.total !==
                          undefined
                          ? `${result.score} of ${result.total} answers correct.`
                          : "Assessment completed."}
                      </p>

                      <div
                        className={`dashboard-result-status ${
                          result.passed
                            ? "passed"
                            : ""
                        }`}
                      >
                        {result.passed
                          ? "Passed"
                          : "Not Passed"}
                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          </div>

        </section>

        <section className="dashboard-cta-section">

          <div className="dashboard-container">

            <div className="dashboard-cta">

              <div>

                <span>
                  KEEP LEARNING
                </span>

                <h2>
                  Every skill you learn
                  <strong>
                    {" "}
                    builds your future.
                  </strong>
                </h2>

                <p>
                  Discover your next course and
                  continue developing practical,
                  career-ready skills.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  browseCourses
                }
              >
                Explore Courses
              </button>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Dashboard