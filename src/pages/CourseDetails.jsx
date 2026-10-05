import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import awsCloudImage from "../assets/courses/aws-cloud.png"

const fallbackImages = {
  mern: "https://cdn.simpleicons.org/react/61DAFB",
  frontend: "https://cdn.simpleicons.org/react/61DAFB",
  datascience: "https://cdn.simpleicons.org/python/3776AB",
  uiux: "https://cdn.simpleicons.org/figma/F24E1E",
  ai: "https://cdn.simpleicons.org/python/3776AB",
  cloud: awsCloudImage
}

const fallbackMeta = {
  mern: {
    tags: [
      "React",
      "Node.js",
      "MongoDB"
    ],
    level: "Advanced",
    oldPrice: 4999,
    projects: "25 projects",
    requirements: [
      "Basic knowledge of HTML, CSS and JavaScript",
      "A computer with internet connection",
      "Willingness to learn and build projects"
    ]
  },

  frontend: {
    tags: [
      "React",
      "JavaScript",
      "CSS"
    ],
    level: "Intermediate",
    oldPrice: 3999,
    projects: "18 projects",
    requirements: [
      "Basic HTML and CSS knowledge",
      "Basic JavaScript fundamentals",
      "Computer with internet connection"
    ]
  },

  datascience: {
    tags: [
      "Python",
      "Pandas",
      "NumPy"
    ],
    level: "Advanced",
    oldPrice: 5499,
    projects: "20 projects",
    requirements: [
      "Basic programming knowledge is helpful",
      "Basic mathematics and statistics",
      "Computer with internet connection"
    ]
  },

  uiux: {
    tags: [
      "Figma",
      "UX Research",
      "Prototyping"
    ],
    level: "Intermediate",
    oldPrice: 3499,
    projects: "12 projects",
    requirements: [
      "No advanced design experience required",
      "Basic computer skills",
      "Figma account recommended"
    ]
  },

  ai: {
    tags: [
      "AI",
      "Machine Learning",
      "Python"
    ],
    level: "Beginner",
    oldPrice: 4499,
    projects: "15 projects",
    requirements: [
      "Basic Python knowledge is helpful",
      "Basic mathematics is recommended",
      "Computer with internet connection"
    ]
  },

  cloud: {
    tags: [
      "AWS",
      "Docker",
      "DevOps"
    ],
    level: "Advanced",
    oldPrice: 5299,
    projects: "16 projects",
    requirements: [
      "Basic programming knowledge",
      "Basic Linux or command-line familiarity",
      "Computer with internet connection"
    ]
  }
}

const fallbackCourseData = {
  mern: {
    courseId: "mern",
    title: "MERN Stack Development",
    description: "Build full-stack web applications using React, Node.js, Express and MongoDB.",
    category: "Web Development",
    price: 2499,
    duration: "45+ hours",
    image: fallbackImages.mern,
    modules: []
  },

  frontend: {
    courseId: "frontend",
    title: "Frontend Development with React",
    description: "Learn modern frontend development with React, JavaScript and responsive design practices.",
    category: "Web Development",
    price: 1999,
    duration: "35+ hours",
    image: fallbackImages.frontend,
    modules: []
  },

  datascience: {
    courseId: "datascience",
    title: "Data Science with Python",
    description: "Learn Python, data analysis, visualization and practical machine learning workflows.",
    category: "Data Science",
    price: 2799,
    duration: "40+ hours",
    image: fallbackImages.datascience,
    modules: []
  },

  uiux: {
    courseId: "uiux",
    title: "UI/UX Design Masterclass",
    description: "Learn user research, interface design, prototyping and practical product design workflows.",
    category: "UI / UX Design",
    price: 1999,
    duration: "30+ hours",
    image: fallbackImages.uiux,
    modules: []
  },

  ai: {
    courseId: "ai",
    title: "Artificial Intelligence Fundamentals",
    description: "Understand AI and machine learning fundamentals with practical Python-based applications.",
    category: "Artificial Intelligence",
    price: 2299,
    duration: "32+ hours",
    image: fallbackImages.ai,
    modules: []
  },

  cloud: {
    courseId: "cloud",
    title: "Cloud & DevOps Engineering",
    description: "Learn cloud infrastructure, AWS, containers, CI/CD and modern DevOps workflows.",
    category: "Cloud & DevOps",
    price: 2699,
    duration: "38+ hours",
    image: fallbackImages.cloud,
    modules: []
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

function getInstructorName(
  instructor
) {
  if (
    typeof instructor ===
    "string"
  ) {
    return instructor
  }

  return (
    instructor?.name ||
    "LearnSphere Instructor"
  )
}

function getLessonCount(
  course
) {
  if (
    !Array.isArray(
      course?.modules
    )
  ) {
    return 0
  }

  return course.modules.reduce(
    (
      total,
      module
    ) =>
      total +
      (Array.isArray(
        module?.lessons
      )
        ? module.lessons.length
        : 0),
    0
  )
}

function getLevel(
  course
) {
  const courseId =
    course?.courseId || ""

  const fallback =
    fallbackMeta[
      courseId
    ]?.level

  if (fallback) {
    return fallback
  }

  const lessons =
    getLessonCount(
      course
    )

  if (lessons >= 15) {
    return "Advanced"
  }

  if (lessons >= 8) {
    return "Intermediate"
  }

  return "Beginner"
}

function getCourseTags(
  course
) {
  const courseId =
    course?.courseId || ""

  const fallbackTags =
    fallbackMeta[
      courseId
    ]?.tags

  if (
    Array.isArray(
      fallbackTags
    ) &&
    fallbackTags.length > 0
  ) {
    return fallbackTags
  }

  const category =
    course?.category ||
    "Course"

  return [
    category
  ]
}

function getRequirements(
  course
) {
  const courseId =
    course?.courseId || ""

  return (
    fallbackMeta[
      courseId
    ]?.requirements || [
      "Basic computer skills",
      "Computer with internet connection",
      "Willingness to learn"
    ]
  )
}

function getCourseImage(
  course
) {
  if (course?.courseId === "cloud") {
    return awsCloudImage
  }

  if (course?.image) {
    return course.image
  }

  return (
    fallbackImages[
      course?.courseId
    ] ||
    fallbackImages.mern
  )
}

function getOldPrice(
  course
) {
  const courseId =
    course?.courseId || ""

  const fallback =
    fallbackMeta[
      courseId
    ]?.oldPrice

  if (
    Number.isFinite(
      Number(fallback)
    )
  ) {
    return Number(
      fallback
    )
  }

  const currentPrice =
    Number(
      course?.price || 0
    )

  return currentPrice > 0
    ? Math.round(
        currentPrice * 2
      )
    : 0
}

function getProjects(
  course
) {
  const courseId =
    course?.courseId || ""

  return (
    fallbackMeta[
      courseId
    ]?.projects ||
    "Practical projects"
  )
}

function getModuleDescription(
  module
) {
  return (
    module?.description ||
    "Practical lessons and hands-on concepts."
  )
}

function CourseDetails() {
  const params =
    new URLSearchParams(
      window.location.search
    )

  const courseId =
    params.get("course")

  const [course, setCourse] =
    useState(null)

  const [isLoadingCourse, setIsLoadingCourse] =
    useState(true)

  const [courseError, setCourseError] =
    useState("")

  const [isEnrolled, setIsEnrolled] =
    useState(false)

  const [enrollmentStatus, setEnrollmentStatus] =
    useState("")

  const [isLoading, setIsLoading] =
    useState(false)

  const [paymentMessage, setPaymentMessage] =
    useState("")

  const [openModule, setOpenModule] =
    useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadCourse() {
      if (!courseId) {
        setCourseError(
          "Course not specified."
        )
        setIsLoadingCourse(false)
        return
      }

      try {
        setIsLoadingCourse(true)
        setCourseError("")

        const response =
          await fetch(
            `http://localhost:5000/api/courses/${encodeURIComponent(
              courseId
            )}`
          )

        const data =
          await response.json()

        if (!response.ok) {
          const fallbackCourse =
            fallbackCourseData[courseId]

          if (!cancelled && fallbackCourse) {
            setCourse(fallbackCourse)
            setCourseError("")
            return
          }

          throw new Error(
            data.message ||
              "Unable to load course."
          )
        }

        if (!cancelled) {
          const loadedCourse =
            data?.course ||
            data ||
            fallbackCourseData[courseId]

          if (loadedCourse) {
            setCourse(loadedCourse)
            setCourseError("")
            return
          }

          throw new Error(
            "Unable to load course."
          )
        }
      } catch (loadError) {
        console.error(
          "Course details loading error:",
          loadError
        )

        if (!cancelled) {
          const fallbackCourse =
            fallbackCourseData[courseId]

          if (fallbackCourse) {
            setCourse(fallbackCourse)
            setCourseError("")
          } else {
            setCourseError(
              loadError.message ||
                "Unable to load course."
            )
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCourse(
            false
          )
        }
      }
    }

    loadCourse()

    return () => {
      cancelled = true
    }
  }, [courseId])

  useEffect(() => {
    let cancelled = false

    async function checkEnrollment() {
      const token =
        localStorage.getItem(
          "learnsphereToken"
        )

      if (!token || !courseId) {
        return
      }

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/payment/course/${encodeURIComponent(
              courseId
            )}`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          return
        }

        if (
          cancelled
        ) {
          return
        }

        const enrolled =
          data?.enrolled ===
            true ||
          data?.isEnrolled ===
            true ||
          data?.enrollment ===
            true

        const status =
          data?.status ||
          data?.enrollment
            ?.status ||
          ""

        setIsEnrolled(
          enrolled
        )

        setEnrollmentStatus(
          status
        )
      } catch (error) {
        console.error(
          "Enrollment status error:",
          error
        )
      }
    }

    checkEnrollment()

    return () => {
      cancelled = true
    }
  }, [courseId])

  async function loadRazorpayScript() {
    if (
      window.Razorpay
    ) {
      return true
    }

    return new Promise(
      (resolve) => {
        const existingScript =
          document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
          )

        if (
          existingScript
        ) {
          existingScript.addEventListener(
            "load",
            () => resolve(true),
            {
              once: true
            }
          )

          existingScript.addEventListener(
            "error",
            () => resolve(false),
            {
              once: true
            }
          )

          return
        }

        const script =
          document.createElement(
            "script"
          )

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js"

        script.async = true

        script.onload =
          () => {
            resolve(
              true
            )
          }

        script.onerror =
          () => {
            resolve(
              false
            )
          }

        document.body.appendChild(
          script
        )
      }
    )
  }

  async function handleEnrollment() {
    if (!course) {
      return
    }

    if (isEnrolled) {
      if (
        enrollmentStatus ===
        "pending"
      ) {
        setPaymentMessage(
          "Your payment is complete and your enrollment is waiting for admin approval."
        )
        return
      }

      window.location.assign(
        `/learning?course=${encodeURIComponent(
          courseId
        )}`
      )

      return
    }

    const token =
      localStorage.getItem(
        "learnsphereToken"
      )

    if (!token) {
      window.location.assign(
        "/login"
      )
      return
    }

    try {
      setIsLoading(
        true
      )

      setPaymentMessage(
        ""
      )

      const razorpayKey =
        import.meta.env
          .VITE_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        setPaymentMessage(
          "Payment configuration is missing."
        )
        return
      }

      if (
        !razorpayKey.startsWith(
          "rzp_test_"
        )
      ) {
        setPaymentMessage(
          "Invalid Razorpay Test Key configuration."
        )
        return
      }

      const scriptLoaded =
        await loadRazorpayScript()

      if (!scriptLoaded) {
        setPaymentMessage(
          "Unable to load payment gateway. Please try again."
        )
        return
      }

      const orderResponse =
        await fetch(
          "http://localhost:5000/api/payment/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              courseId
            })
          }
        )

      const orderData =
        await orderResponse.json()

      if (
        !orderResponse.ok
      ) {
        setPaymentMessage(
          orderData.message ||
            "Unable to create payment order."
        )
        return
      }

      if (
        !orderData.orderId
      ) {
        setPaymentMessage(
          "Payment order ID was not received."
        )
        return
      }

      const user =
        getStoredUser()

      const options = {
        key:
          razorpayKey,

        amount:
          orderData.amount,

        currency:
          orderData.currency,

        name:
          "LearnSphere",

        description:
          course.title,

        order_id:
          orderData.orderId,

        prefill: {
          name:
            user?.name ||
            "",

          email:
            user?.email ||
            ""
        },

        notes: {
          courseId
        },

        theme: {
          color:
            "#6c63ff"
        },

        handler:
          async function (
            response
          ) {
            try {
              setPaymentMessage(
                "Verifying payment..."
              )

              const verifyResponse =
                await fetch(
                  "http://localhost:5000/api/payment/verify",
                  {
                    method:
                      "POST",
                    headers: {
                      "Content-Type":
                        "application/json",
                      Authorization:
                        `Bearer ${token}`
                    },
                    body: JSON.stringify(
                      {
                        razorpay_order_id:
                          response.razorpay_order_id,

                        razorpay_payment_id:
                          response.razorpay_payment_id,

                        razorpay_signature:
                          response.razorpay_signature
                      }
                    )
                  }
                )

              const verifyData =
                await verifyResponse.json()

              if (
                !verifyResponse.ok
              ) {
                setPaymentMessage(
                  verifyData.message ||
                    "Payment verification failed."
                )
                return
              }

              setPaymentMessage(
                "Payment successful. Enrollment is waiting for admin approval."
              )

              setIsEnrolled(
                true
              )

              setEnrollmentStatus(
                "pending"
              )
            } catch (error) {
              console.error(
                "Payment verification error:",
                error
              )

              setPaymentMessage(
                "Payment was completed, but verification failed."
              )
            }
          },

        modal: {
          ondismiss:
            function () {
              setPaymentMessage(
                "Payment cancelled."
              )
            }
        }
      }

      const razorpay =
        new window.Razorpay(
          options
        )

      razorpay.open()
    } catch (error) {
      console.error(
        "Payment error:",
        error
      )

      setPaymentMessage(
        "Unable to start payment. Please try again."
      )
    } finally {
      setIsLoading(
        false
      )
    }
  }

  function goToCourses() {
    window.location.assign(
      "/courses"
    )
  }

  function goToLearning() {
    window.location.assign(
      `/learning?course=${encodeURIComponent(
        courseId
      )}`
    )
  }

  if (
    isLoadingCourse
  ) {
    return (
      <>
        <Navbar />

        <main className="course-details-page">

          <section className="course-details-hero">

            <div className="course-details-container">

              <div className="course-details-main">

                <span className="course-details-label">
                  LEARNSPHERE COURSE
                </span>

                <h1>
                  Loading course...
                </h1>

                <p className="course-details-description">
                  Loading the latest course
                  information.
                </p>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  if (
    !course ||
    courseError
  ) {
    return (
      <>
        <Navbar />

        <main className="course-details-page">

          <section className="course-details-hero">

            <div className="course-details-container">

              <div className="course-details-main">

                <span className="course-details-label">
                  COURSE
                </span>

                <h1>
                  Course Not Found
                </h1>

                <p className="course-details-description">
                  {courseError ||
                    "The requested course could not be found."}
                </p>

                <div className="course-details-tags">

                  <button
                    type="button"
                    className="enroll-course-btn"
                    onClick={
                      goToCourses
                    }
                  >
                    Browse Courses
                  </button>

                </div>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  const instructor =
    getInstructorName(
      course.instructor
    )

  const image =
    getCourseImage(
      course
    )

  const tags =
    getCourseTags(
      course
    )

  const level =
    getLevel(
      course
    )

  const lessonCount =
    getLessonCount(
      course
    )

  const oldPrice =
    getOldPrice(
      course
    )

  const requirements =
    getRequirements(
      course
    )

  const projects =
    getProjects(
      course
    )

  const modules =
    Array.isArray(
      course.modules
    )
      ? course.modules
      : []

  const price =
    Number(
      course.price || 0
    )

  return (
    <>
      <Navbar />

      <main className="course-details-page">

        <section className="course-details-hero">

          <div className="course-details-container">

            <div className="course-details-main">

              <span className="course-details-label">
                {course.category ||
                  "COURSE"}
              </span>

              <h1>
                {course.title}
              </h1>

              <p className="course-details-description">
                {course.description ||
                  "Build practical skills through structured lessons and hands-on learning."}
              </p>

              <div className="course-details-rating">

                <strong>
                  ★ 4.9
                </strong>

                <span>
                  {lessonCount} lessons
                </span>

                <span>
                  {level}
                </span>

                {course.duration && (
                  <span>
                    {course.duration}
                  </span>
                )}

              </div>

              <p className="course-details-instructor">
                Created by{" "}
                <strong>
                  {instructor}
                </strong>
              </p>

              <div className="course-details-tags">

                {tags.map(
                  (tag) => (
                    <span
                      key={
                        tag
                      }
                    >
                      {tag}
                    </span>
                  )
                )}

              </div>

            </div>

            <div className="course-preview-card">

              <div className="course-preview-image">

                <div className="preview-glow"></div>

                <img
                  src={
                    image
                  }
                  alt={
                    course.title
                  }
                  onError={(
                    event
                  ) => {
                    event.currentTarget.src =
                      fallbackImages.mern
                  }}
                />

              </div>

              <div className="course-preview-content">

                <div className="course-price">

                  <strong>
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {oldPrice >
                    price && (
                    <del>
                      ₹
                      {oldPrice.toLocaleString(
                        "en-IN"
                      )}
                    </del>
                  )}

                </div>

                <button
                  type="button"
                  className="enroll-course-btn"
                  onClick={
                    handleEnrollment
                  }
                  disabled={
                    isLoading
                  }
                >
                  {isLoading
                    ? "Processing..."
                    : isEnrolled &&
                        enrollmentStatus !==
                          "pending"
                      ? "Go to Learning"
                      : isEnrolled &&
                          enrollmentStatus ===
                            "pending"
                        ? "Pending Approval"
                        : "Enroll Now"}
                </button>

                {paymentMessage && (
                  <p className="payment-message">
                    {paymentMessage}
                  </p>
                )}

                <p>
                  Secure Razorpay payment
                </p>

                <div className="course-includes">

                  <strong>
                    This course includes:
                  </strong>

                  <span>
                    ✓{" "}
                    {course.duration ||
                      "Structured learning"}
                  </span>

                  <span>
                    ✓{" "}
                    {lessonCount} lessons
                  </span>

                  <span>
                    ✓{" "}
                    {projects}
                  </span>

                  <span>
                    ✓ Course certificate
                  </span>

                  <span>
                    ✓ Lifetime access
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="course-details-content">

          <div className="course-details-left">

            <div className="details-section">

              <span className="section-label">
                COURSE OVERVIEW
              </span>

              <h2>
                What you'll learn
              </h2>

              <div className="learning-points">

                {modules.length >
                0 ? (
                  modules
                    .slice(
                      0,
                      6
                    )
                    .map(
                      (
                        module
                      ) => (
                        <div
                          key={
                            module._id ||
                            module.title
                          }
                        >
                          ✓{" "}
                          {module.title ||
                            "Course module"}
                        </div>
                      )
                    )
                ) : (
                  <>
                    <div>
                      ✓ Build practical skills
                    </div>

                    <div>
                      ✓ Learn through structured lessons
                    </div>

                    <div>
                      ✓ Apply concepts through practice
                    </div>
                  </>
                )}

              </div>

            </div>

            <div className="details-section">

              <span className="section-label">
                COURSE CONTENT
              </span>

              <h2>
                Course curriculum
              </h2>

              {modules.length >
              0 ? (
                <div className="course-module-list">

                  {modules.map(
                    (
                      module,
                      index
                    ) => {

                      const moduleKey =
                        module._id ||
                        String(
                          index
                        )

                      const lessons =
                        Array.isArray(
                          module.lessons
                        )
                          ? module.lessons
                          : []

                      return (
                        <div
                          className={`course-module ${
                            openModule ===
                            moduleKey
                              ? "module-open"
                              : ""
                          }`}
                          key={
                            moduleKey
                          }
                        >

                          <button
                            type="button"
                            className="course-module-header"
                            onClick={() =>
                              setOpenModule(
                                openModule ===
                                moduleKey
                                  ? null
                                  : moduleKey
                              )
                            }
                          >

                            <div className="course-module-title">

                              <strong>
                                {String(
                                  index +
                                    1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </strong>

                              <div>

                                <h3>
                                  {module.title ||
                                    `Module ${
                                      index +
                                      1
                                    }`}
                                </h3>

                                <p>
                                  {getModuleDescription(
                                    module
                                  )}
                                </p>

                              </div>

                            </div>

                            <div className="course-module-meta">

                              <span>
                                {lessons.length}{" "}
                                {lessons.length ===
                                1
                                  ? "lesson"
                                  : "lessons"}
                              </span>

                              <span className="module-arrow">
                                {openModule ===
                                moduleKey
                                  ? "−"
                                  : "+"}
                              </span>

                            </div>

                          </button>

                          {openModule ===
                            moduleKey && (
                            <div className="course-module-lessons">

                              {lessons.length >
                              0 ? (
                                lessons.map(
                                  (
                                    lesson,
                                    lessonIndex
                                  ) => (
                                    <div
                                      key={
                                        lesson._id ||
                                        lessonIndex
                                      }
                                    >
                                      <span>
                                        {String(
                                          lessonIndex +
                                            1
                                        ).padStart(
                                          2,
                                          "0"
                                        )}
                                      </span>

                                      <div>

                                        <strong>
                                          {lesson.title ||
                                            `Lesson ${
                                              lessonIndex +
                                              1
                                            }`}
                                        </strong>

                                        {lesson.description && (
                                          <p>
                                            {
                                              lesson.description
                                            }
                                          </p>
                                        )}

                                      </div>

                                    </div>
                                  )
                                )
                              ) : (
                                <div>
                                  No lessons added yet.
                                </div>
                              )}

                            </div>
                          )}

                        </div>
                      )
                    }
                  )}

                </div>
              ) : (
                <div className="courses-empty">

                  <div>
                    📚
                  </div>

                  <h3>
                    Course content is being prepared
                  </h3>

                  <p>
                    Lessons will appear here when
                    the instructor adds them.
                  </p>

                </div>
              )}

            </div>

            <div className="details-section">

              <span className="section-label">
                REQUIREMENTS
              </span>

              <h2>
                Before you start
              </h2>

              <ul className="course-requirements">

                {requirements.map(
                  (
                    item
                  ) => (
                    <li
                      key={
                        item
                      }
                    >
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="details-section course-certificate-section">

              <div>

                <span className="section-label">
                  CERTIFICATE
                </span>

                <h2>
                  Earn a LearnSphere certificate
                </h2>

                <p>
                  Complete all course lessons and
                  finish the available assessment to
                  continue to your LearnSphere
                  certificate.
                </p>

              </div>

              <div className="certificate-mark">
                LS
              </div>

            </div>

            <div className="details-section">

              <div
                className="course-details-tags"
                style={{
                  marginTop:
                    "10px"
                }}
              >

                {isEnrolled &&
                  enrollmentStatus ===
                    "pending" && (
                    <span>
                      Enrollment pending
                    </span>
                  )}

                {isEnrolled &&
                  enrollmentStatus !==
                    "pending" && (
                    <button
                      type="button"
                      className="enroll-course-btn"
                      onClick={
                        goToLearning
                      }
                    >
                      Continue Learning
                    </button>
                  )}

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default CourseDetails