import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import awsCloudImage from "../assets/courses/aws-cloud.png"

const categoryMeta = {
  "Web Development": {
    icon: "💻"
  },
  "Data Science": {
    icon: "📊"
  },
  "UI / UX Design": {
    icon: "🎨"
  },
  "Artificial Intelligence": {
    icon: "🤖"
  },
  "Mobile Development": {
    icon: "📱"
  },
  "Cloud & DevOps": {
    icon: "☁️"
  }
}

const fallbackCategories = [
  {
    icon: "💻",
    name: "Web Development"
  },
  {
    icon: "📊",
    name: "Data Science"
  },
  {
    icon: "🎨",
    name: "UI / UX Design"
  },
  {
    icon: "🤖",
    name: "Artificial Intelligence"
  },
  {
    icon: "📱",
    name: "Mobile Development"
  },
  {
    icon: "☁️",
    name: "Cloud & DevOps"
  }
]

const fallbackImages = {
  mern:
    "https://cdn.simpleicons.org/react/61DAFB",

  frontend:
    "https://cdn.simpleicons.org/react/61DAFB",

  datascience:
    "https://cdn.simpleicons.org/python/3776AB",

  uiux:
    "https://cdn.simpleicons.org/figma/F24E1E",

  ai:
    "https://cdn.simpleicons.org/python/3776AB",

  cloud:
    awsCloudImage
}

function getCourseId(course) {
  return (
    course?.courseId ||
    course?._id ||
    course?.id ||
    ""
  )
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

function getCourseType(course) {
  const category =
    (
      course?.category ||
      ""
    ).toLowerCase()

  if (
    category.includes("ui") ||
    category.includes("ux") ||
    category.includes("design")
  ) {
    return "design"
  }

  if (
    category.includes("data")
  ) {
    return "data"
  }

  return "mern"
}

function getCourseImage(course) {
  if (getCourseId(course) === "cloud") {
    return awsCloudImage
  }

  if (course?.image) {
    return course.image
  }

  return (
    fallbackImages[
      getCourseId(
        course
      )
    ] ||
    fallbackImages.mern
  )
}

function getLessonCount(course) {
  if (
    !Array.isArray(
      course?.modules
    )
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

function getLevel(course) {
  const lessons =
    getLessonCount(course)

  if (lessons >= 15) {
    return "Advanced"
  }

  if (lessons >= 8) {
    return "Intermediate"
  }

  return "Beginner"
}

function Home() {
  const [courses, setCourses] =
    useState([])

  const [instructors, setInstructors] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [searchTerm, setSearchTerm] =
    useState("")

  useEffect(() => {
    let cancelled = false

    async function loadHomeData() {
      try {
        const [
          coursesResponse,
          instructorsResponse
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/courses"
          ),

          fetch(
            "http://localhost:5000/api/instructors"
          )
        ])

        const coursesData =
          await coursesResponse.json()

        const instructorsData =
          await instructorsResponse.json()

        if (cancelled) {
          return
        }

        const backendCourses =
          Array.isArray(
            coursesData
          )
            ? coursesData
            : Array.isArray(
                coursesData?.courses
              )
              ? coursesData.courses
              : []

        const backendInstructors =
          Array.isArray(
            instructorsData
          )
            ? instructorsData
            : Array.isArray(
                instructorsData?.instructors
              )
              ? instructorsData.instructors
              : []

        setCourses(
          backendCourses
        )

        setInstructors(
          backendInstructors
        )
      } catch (error) {
        console.error(
          "Home data loading error:",
          error
        )

        if (!cancelled) {
          setCourses([])
          setInstructors([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [])

  function handleSearch(event) {
    event.preventDefault()

    const value =
      searchTerm.trim()

    if (!value) {
      window.location.assign(
        "/courses"
      )
      return
    }

    window.location.assign(
      `/courses?search=${encodeURIComponent(
        value
      )}`
    )
  }

  function browseCategory(
    category
  ) {
    window.location.assign(
      `/courses?category=${encodeURIComponent(
        category
      )}`
    )
  }

  function openCourse(
    courseId
  ) {
    window.location.assign(
      `/course-details?course=${encodeURIComponent(
        courseId
      )}`
    )
  }

  const categoryMap = {}

  courses.forEach((course) => {
    const category =
      course?.category?.trim()

    if (!category) {
      return
    }

    categoryMap[category] =
      (categoryMap[category] ||
        0) + 1
  })

  const categories =
    fallbackCategories.map(
      (category) => ({
        ...category,
        courses:
          categoryMap[
            category.name
          ] || 0
      })
    )

  const extraCategories =
    Object.keys(
      categoryMap
    )
      .filter(
        (category) =>
          !fallbackCategories.some(
            (item) =>
              item.name === category
          )
      )
      .map((category) => ({
        icon:
          categoryMeta[
            category
          ]?.icon || "📚",
        name: category,
        courses:
          categoryMap[
            category
          ]
      }))

  const allCategories = [
    ...categories,
    ...extraCategories
  ].slice(0, 8)

  const popularCourses =
    courses.slice(0, 3)

  const featuredInstructors =
    instructors.slice(0, 3)

  return (
    <>
      <Navbar />

      <main>

        <section className="hero-section">

          <div className="hero-grid"></div>

          <div className="hero-orb hero-orb-one"></div>
          <div className="hero-orb hero-orb-two"></div>

          <div className="hero-particles">

            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

          </div>

          <div className="hero-content">

            <div className="hero-badge">
              <span>✦</span>
              Learn without limits
            </div>

            <h1>
              Learn Today.
              <br />
              <span>
                Build Tomorrow.
              </span>
            </h1>

            <p className="hero-description">
              Learn practical skills from
              industry experts, build real-world
              projects, and take the next step
              toward your career.
            </p>

            <form
              className="hero-search"
              onSubmit={
                handleSearch
              }
            >

              <span>⌕</span>

              <input
                type="text"
                placeholder="What do you want to learn?"
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              <button
                type="submit"
              >
                Search
              </button>

            </form>

            <div className="hero-buttons">

              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  window.location.assign(
                    "/courses"
                  )
                }
              >
                Explore Courses
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  window.location.assign(
                    "/courses"
                  )
                }
              >
                Start Learning
                <span>→</span>
              </button>

            </div>

            <div className="hero-trust">

              <div className="trust-avatars">

                <span>
                  AK
                </span>

                <span>
                  PN
                </span>

                <span>
                  RM
                </span>

                <span>
                  +
                </span>

              </div>

              <div>

                <strong>
                  50,000+ learners
                </strong>

                <p>
                  are growing with LearnSphere
                </p>

              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="visual-ring ring-one"></div>
            <div className="visual-ring ring-two"></div>

            <div className="learning-orbit orbit-one">
              <span>
                HTML
              </span>
            </div>

            <div className="learning-orbit orbit-two">
              <span>
                JS
              </span>
            </div>

            <div className="learning-orbit orbit-three">
              <span>
                AI
              </span>
            </div>

            <div className="learning-core">

              <div className="core-icon">
                ✦
              </div>

              <strong>
                LEARN
              </strong>

              <span>
                GROW • BUILD • CREATE
              </span>

            </div>

            <div className="floating-card floating-card-one">

              <span className="floating-icon">
                ✓
              </span>

              <div>

                <strong>
                  Project Based
                </strong>

                <small>
                  Practical learning
                </small>

              </div>

            </div>

            <div className="floating-card floating-card-two">

              <span className="floating-icon">
                ★
              </span>

              <div>

                <strong>
                  4.9 / 5
                </strong>

                <small>
                  Student rating
                </small>

              </div>

            </div>

          </div>

        </section>

        <section className="stats-section">

          <div className="stats-container">

            <div>

              <strong>
                50K+
              </strong>

              <span>
                Active Learners
              </span>

            </div>

            <div>

              <strong>
                {loading
                  ? "—"
                  : courses.length}
              </strong>

              <span>
                Available Courses
              </span>

            </div>

            <div>

              <strong>
                {loading
                  ? "—"
                  : instructors.length}
              </strong>

              <span>
                Industry Instructors
              </span>

            </div>

            <div>

              <strong>
                95%
              </strong>

              <span>
                Completion Rate
              </span>

            </div>

          </div>

        </section>

        <section className="categories-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                EXPLORE SKILLS
              </span>

              <h2>
                What do you want to learn?
              </h2>

            </div>

            <a href="/courses">
              View all categories →
            </a>

          </div>

          <div className="category-grid">

            {allCategories.map(
              (category) => (

                <button
                  type="button"
                  className="category-card"
                  key={
                    category.name
                  }
                  onClick={() =>
                    browseCategory(
                      category.name
                    )
                  }
                >

                  <div className="category-icon">
                    {category.icon}
                  </div>

                  <div>

                    <h3>
                      {category.name}
                    </h3>

                    <p>
                      {category.courses > 0
                        ? `${category.courses} Course${
                            category.courses ===
                            1
                              ? ""
                              : "s"
                          }`
                        : "Explore courses"}
                    </p>

                  </div>

                  <span className="category-arrow">
                    →
                  </span>

                </button>
              )
            )}

          </div>

        </section>

        <section className="courses-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                POPULAR COURSES
              </span>

              <h2>
                Learn skills that matter
              </h2>

            </div>

            <a href="/courses">
              Explore all courses →
            </a>

          </div>

          {loading ? (
            <div className="course-grid">

              {[1, 2, 3].map(
                (item) => (

                  <article
                    className="course-card"
                    key={item}
                  >

                    <div className="course-image course-mern">

                      <div className="course-visual-glow"></div>

                      <div className="course-logo-stage">

                        <div className="course-logo-window">

                          <div className="course-window-top">

                            <span></span>
                            <span></span>
                            <span></span>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="course-content">

                      <div className="course-rating">
                        Loading...
                      </div>

                      <h3>
                        Loading course...
                      </h3>

                      <p className="course-instructor">
                        LearnSphere
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>
          ) : popularCourses.length ===
            0 ? (
            <div
              className="instructors-empty"
              style={{
                marginTop:
                  "30px"
              }}
            >

              <div>
                📚
              </div>

              <h3>
                No courses available yet
              </h3>

              <p>
                New courses will appear here
                when they are published.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.assign(
                    "/courses"
                  )
                }
              >
                Browse Courses
              </button>

            </div>
          ) : (
            <div className="course-grid">

              {popularCourses.map(
                (course) => {

                  const courseId =
                    getCourseId(
                      course
                    )

                  const type =
                    getCourseType(
                      course
                    )

                  const instructor =
                    getInstructorName(
                      course
                    )

                  const image =
                    getCourseImage(
                      course
                    )

                  const level =
                    getLevel(
                      course
                    )

                  return (
                    <article
                      className="course-card"
                      key={
                        courseId
                      }
                    >

                      <div
                        className={`course-image course-${type}`}
                      >

                        <div className="course-visual-glow"></div>

                        <div className="course-logo-stage">

                          <div className="course-logo-window">

                            <div className="course-window-top">

                              <span></span>
                              <span></span>
                              <span></span>

                            </div>

                            <div
                              style={{
                                height:
                                  "calc(100% - 24px)",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                padding:
                                  "20px"
                              }}
                            >

                              <img
                                src={
                                  image
                                }
                                alt={
                                  course.title ||
                                  "Course"
                                }
                                style={{
                                  width:
                                    "72px",
                                  height:
                                    "72px",
                                  objectFit:
                                    "contain"
                                }}
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.src =
                                    fallbackImages.mern
                                }}
                              />

                            </div>

                          </div>

                        </div>

                        <span className="course-level">
                          {level}
                        </span>

                      </div>

                      <div className="course-content">

                        <div className="course-rating">

                          <span>
                            ★
                          </span>

                          4.9

                          <small>
                            {getLessonCount(
                              course
                            )} lessons
                          </small>

                        </div>

                        <h3>
                          {course.title}
                        </h3>

                        <p className="course-instructor">
                          By {instructor}
                        </p>

                        <div className="course-bottom">

                          <strong>
                            ₹
                            {Number(
                              course.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              openCourse(
                                courseId
                              )
                            }
                          >
                            View Course →
                          </button>

                        </div>

                      </div>

                    </article>
                  )
                }
              )}

            </div>
          )}

        </section>

        <section className="why-section">

          <div className="why-visual">

            <div className="why-grid"></div>

            <div className="why-card-main">

              <span>
                LEARNING
              </span>

              <strong>
                85%
              </strong>

              <div className="progress-bar">
                <span></span>
              </div>

              <small>
                Weekly progress
              </small>

            </div>

            <div className="why-mini-card">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  Course completed
                </strong>

                <small>
                  JavaScript Essentials
                </small>

              </div>

            </div>

          </div>

          <div className="why-content">

            <span className="section-label">
              WHY LEARNSPHERE
            </span>

            <h2>
              Learning designed for
              <span>
                {" "}
                your growth.
              </span>
            </h2>

            <p>
              We combine expert knowledge,
              practical projects, and a flexible
              learning experience to help you build
              skills that create real opportunities.
            </p>

            <div className="why-list">

              <div>

                <span>
                  01
                </span>

                <div>

                  <h3>
                    Learn from experts
                  </h3>

                  <p>
                    Get practical knowledge from
                    experienced industry professionals.
                  </p>

                </div>

              </div>

              <div>

                <span>
                  02
                </span>

                <div>

                  <h3>
                    Build real projects
                  </h3>

                  <p>
                    Turn your knowledge into projects
                    that demonstrate your abilities.
                  </p>

                </div>

              </div>

              <div>

                <span>
                  03
                </span>

                <div>

                  <h3>
                    Learn at your pace
                  </h3>

                  <p>
                    Study whenever you want with
                    flexible learning paths.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="instructors-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                LEARN FROM EXPERTS
              </span>

              <h2>
                Meet our instructors
              </h2>

            </div>

            <a href="/instructors">
              View all instructors →
            </a>

          </div>

          {featuredInstructors.length ===
          0 ? (
            <div className="instructors-empty">

              <div>
                👨‍🏫
              </div>

              <h3>
                No instructors available yet
              </h3>

              <p>
                Instructor profiles will
                appear here when available.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.assign(
                    "/instructors"
                  )
                }
              >
                View Instructors
              </button>

            </div>
          ) : (
            <div className="instructor-grid">

              {featuredInstructors.map(
                (instructor) => {

                  const id =
                    instructor.id ||
                    instructor._id

                  const name =
                    instructor.name ||
                    "Instructor"

                  const expertise =
                    instructor.expertise ||
                    instructor.bio ||
                    "Industry Professional"

                  const courseCount =
                    instructor.courseCount ??
                    instructor.courses?.length ??
                    0

                  const studentCount =
                    instructor.studentCount ??
                    0

                  const image =
                    instructor.photo ||
                    instructor.image ||
                    ""

                  return (
                    <div
                      className="instructor-card"
                      key={
                        id ||
                        name
                      }
                    >

                      <div className="instructor-avatar">

                        {image ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              name
                            }
                          />
                        ) : (
                          <span>
                            {name
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </span>
                        )}

                      </div>

                      <h3>
                        {name}
                      </h3>

                      <p>
                        {expertise}
                      </p>

                      <div className="instructor-details">

                        <span>
                          {studentCount} Students
                        </span>

                        <span>
                          {courseCount} Courses
                        </span>

                      </div>

                    </div>
                  )
                }
              )}

            </div>
          )}

        </section>

        <section className="testimonials-section">

          <div className="section-heading centered-heading">

            <div>

              <span className="section-label">
                LEARNER STORIES
              </span>

              <h2>
                Loved by learners
              </h2>

            </div>

          </div>

          <div className="testimonial-grid">

            <article className="testimonial-card">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p>
                "LearnSphere helped me turn my
                learning into practical skills.
                The courses are structured and
                easy to follow."
              </p>

              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  <span>
                    AK
                  </span>
                </div>

                <span>

                  <strong>
                    Aarav Kumar
                  </strong>

                  <small>
                    Software Developer
                  </small>

                </span>

              </div>

            </article>

            <article className="testimonial-card">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p>
                "The instructors explain complex
                topics clearly. I was able to build
                real projects while learning."
              </p>

              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  <span>
                    AR
                  </span>
                </div>

                <span>

                  <strong>
                    Ananya Rao
                  </strong>

                  <small>
                    UI/UX Designer
                  </small>

                </span>

              </div>

            </article>

            <article className="testimonial-card">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p>
                "The learning experience feels
                practical and career-focused.
                The project-based approach made
                a big difference."
              </p>

              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  <span>
                    VS
                  </span>
                </div>

                <span>

                  <strong>
                    Vikram Singh
                  </strong>

                  <small>
                    Data Analyst
                  </small>

                </span>

              </div>

            </article>

          </div>

        </section>

        <section className="cta-section">

          <div className="cta-glow"></div>

          <div className="cta-content">

            <span className="section-label">
              START YOUR JOURNEY
            </span>

            <h2>
              Your next skill
              <br />
              starts here.
            </h2>

            <p>
              Join learners building skills,
              projects, and better careers with
              LearnSphere.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                window.location.assign(
                  "/courses"
                )
              }
            >
              Start Learning Today →
            </button>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Home