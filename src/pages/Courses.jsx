import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import awsCloudImage from "../assets/courses/aws-cloud.png"

const categories = [
  "All Courses",
  "Web Development",
  "Data Science",
  "UI / UX Design",
  "Artificial Intelligence",
  "Mobile Development",
  "Cloud & DevOps"
]

const fallbackCourses = [
  {
    id: "mern",
    courseId: "mern",
    title: "MERN Stack Development",
    category: "Web Development",
    instructor: "Arjun Sharma",
    rating: "4.9",
    students: "12.5K",
    level: "Advanced",
    price: 2499,
    oldPrice: "₹4,999",
    image: "https://cdn.simpleicons.org/react/61DAFB",
    tags: ["React", "Node.js", "MongoDB"],
    modules: []
  },
  {
    id: "frontend",
    courseId: "frontend",
    title: "Frontend Development with React",
    category: "Web Development",
    instructor: "Ananya Rao",
    rating: "4.8",
    students: "9.8K",
    level: "Intermediate",
    price: 1999,
    oldPrice: "₹3,999",
    image: "https://cdn.simpleicons.org/react/61DAFB",
    tags: ["React", "JavaScript", "CSS"],
    modules: []
  },
  {
    id: "datascience",
    courseId: "datascience",
    title: "Data Science with Python",
    category: "Data Science",
    instructor: "Rahul Mehta",
    rating: "4.9",
    students: "15.7K",
    level: "Advanced",
    price: 2799,
    oldPrice: "₹5,499",
    image: "https://cdn.simpleicons.org/python/3776AB",
    tags: ["Python", "Pandas", "NumPy"],
    modules: []
  },
  {
    id: "uiux",
    courseId: "uiux",
    title: "UI/UX Design Masterclass",
    category: "UI / UX Design",
    instructor: "Priya Nair",
    rating: "4.8",
    students: "8.2K",
    level: "Intermediate",
    price: 1999,
    oldPrice: "₹3,499",
    image: "https://cdn.simpleicons.org/figma/F24E1E",
    tags: ["Figma", "UX Research", "Prototyping"],
    modules: []
  },
  {
    id: "ai",
    courseId: "ai",
    title: "Artificial Intelligence Fundamentals",
    category: "Artificial Intelligence",
    instructor: "Vikram Singh",
    rating: "4.7",
    students: "7.4K",
    level: "Beginner",
    price: 2299,
    oldPrice: "₹4,499",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    tags: ["AI", "Machine Learning", "Python"],
    modules: []
  },
  {
    id: "cloud",
    courseId: "cloud",
    title: "Cloud & DevOps Engineering",
    category: "Cloud & DevOps",
    instructor: "Karan Verma",
    rating: "4.8",
    students: "6.9K",
    level: "Advanced",
    price: 2699,
    oldPrice: "₹5,299",
    image: awsCloudImage,
    tags: ["AWS", "Docker", "DevOps"],
    modules: []
  }
]

function mergeCourses(liveCourses) {
  const fallbackMap = new Map(
    fallbackCourses.map((course) => [course.courseId, course])
  )

  const mergedCourses = []

  liveCourses.forEach((course) => {
    const courseId =
      course?.courseId ||
      course?._id ||
      course?.id ||
      ""

    const base = fallbackMap.get(courseId) || {}

    mergedCourses.push({
      ...base,
      ...course,
      id: course?.courseId || course?._id || course?.id || base.id,
      courseId: course?.courseId || base.courseId,
      title: course?.title || base.title || courseId,
      category: course?.category || base.category || "Course",
      instructor:
        course?.instructor?.name ||
        (typeof course?.instructor === "string"
          ? course.instructor
          : "") ||
        base.instructor ||
        "LearnSphere Instructor",
      price:
        course?.price !== undefined
          ? course.price
          : base.price || 0,
      image: course?.image || base.image || "",
      tags:
        Array.isArray(course?.tags) && course.tags.length > 0
          ? course.tags
          : base.tags || [],
      level: course?.level || base.level,
      modules: Array.isArray(course?.modules)
        ? course.modules
        : base.modules || []
    })

    if (courseId) {
      fallbackMap.delete(courseId)
    }
  })

  return [
    ...mergedCourses,
    ...fallbackMap.values()
  ]
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
  if (course?.level) {
    return course.level
  }

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

function getCourseImage(course) {
  const courseId =
    getCourseId(course)

  if (courseId === "cloud") {
    return awsCloudImage
  }

  if (course?.image) {
    return course.image
  }

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
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    cloud:
      awsCloudImage
  }

  return (
    fallbackImages[
      courseId
    ] ||
    fallbackImages.mern
  )
}

function getTags(course) {
  if (
    Array.isArray(course?.tags) &&
    course.tags.length > 0
  ) {
    return course.tags
  }

  const category =
    course?.category ||
    ""

  if (
    category
      .toLowerCase()
      .includes("web")
  ) {
    return [
      "React",
      "JavaScript",
      "Web Development"
    ]
  }

  if (
    category
      .toLowerCase()
      .includes("data")
  ) {
    return [
      "Python",
      "Pandas",
      "Data Science"
    ]
  }

  if (
    category
      .toLowerCase()
      .includes("design")
  ) {
    return [
      "UI/UX",
      "Figma",
      "Design"
    ]
  }

  if (
    category
      .toLowerCase()
      .includes("artificial")
  ) {
    return [
      "AI",
      "Machine Learning",
      "Python"
    ]
  }

  if (
    category
      .toLowerCase()
      .includes("cloud")
  ) {
    return [
      "AWS",
      "Docker",
      "DevOps"
    ]
  }

  return [
    category || "Course"
  ]
}

function Courses() {
  const params =
    new URLSearchParams(
      window.location.search
    )

  const urlCategory =
    params.get("category")

  const urlSearch =
    params.get("search") || ""

  const initialCategory =
    categories.includes(
      urlCategory
    )
      ? urlCategory
      : "All Courses"

  const [courses, setCourses] =
    useState(fallbackCourses)

  const [selectedCategory, setSelectedCategory] =
    useState(
      initialCategory
    )

  const [selectedLevel, setSelectedLevel] =
    useState(
      "All Levels"
    )

  const [searchTerm, setSearchTerm] =
    useState(
      urlSearch
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            "http://localhost:5000/api/courses"
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load courses."
          )
        }

        const backendCourses =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data?.courses
              )
              ? data.courses
              : []

        if (!cancelled) {
          setCourses(
            mergeCourses(
              backendCourses
            )
          )
        }
      } catch (loadError) {
        console.error(
          "Courses loading error:",
          loadError
        )

        if (!cancelled) {
          setCourses(
            fallbackCourses
          )
          setError("")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCourses()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredCourses =
    courses.filter(
      (course) => {
        const categoryMatch =
          selectedCategory ===
            "All Courses" ||
          course.category ===
            selectedCategory

        const level =
          getLevel(course)

        const levelMatch =
          selectedLevel ===
            "All Levels" ||
          level ===
            selectedLevel

        const searchValue =
          searchTerm
            .toLowerCase()
            .trim()

        const instructor =
          getInstructorName(
            course
          )

        const tags =
          getTags(course)

        const searchMatch =
          !searchValue ||
          String(
            course.title || ""
          )
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          String(
            course.category ||
              ""
          )
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          instructor
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          tags.some((tag) =>
            tag
              .toLowerCase()
              .includes(
                searchValue
              )
          )

        return (
          categoryMatch &&
          levelMatch &&
          searchMatch
        )
      }
    )

  function handleCategoryChange(
    category
  ) {
    setSelectedCategory(
      category
    )

    const query =
      new URLSearchParams()

    if (
      category !==
      "All Courses"
    ) {
      query.set(
        "category",
        category
      )
    }

    if (
      searchTerm.trim()
    ) {
      query.set(
        "search",
        searchTerm.trim()
      )
    }

    const queryString =
      query.toString()

    window.history.replaceState(
      {},
      "",
      queryString
        ? `/courses?${queryString}`
        : "/courses"
    )
  }

  function handleSearch(
    event
  ) {
    event.preventDefault()

    const query =
      new URLSearchParams()

    if (
      selectedCategory !==
      "All Courses"
    ) {
      query.set(
        "category",
        selectedCategory
      )
    }

    if (
      searchTerm.trim()
    ) {
      query.set(
        "search",
        searchTerm.trim()
      )
    }

    const queryString =
      query.toString()

    window.history.replaceState(
      {},
      "",
      queryString
        ? `/courses?${queryString}`
        : "/courses"
    )
  }

  function handleViewCourse(
    courseId
  ) {
    window.location.assign(
      `/course-details?course=${encodeURIComponent(
        courseId
      )}`
    )
  }

  function resetFilters() {
    setSelectedCategory(
      "All Courses"
    )

    setSelectedLevel(
      "All Levels"
    )

    setSearchTerm("")

    window.history.replaceState(
      {},
      "",
      "/courses"
    )
  }

  function handleStartLearning() {
    if (
      filteredCourses.length >
      0
    ) {
      const firstCourse =
        filteredCourses[0]

      handleViewCourse(
        getCourseId(
          firstCourse
        )
      )

      return
    }

    resetFilters()
  }

  return (
    <>
      <Navbar />

      <main className="courses-page">

        <section className="courses-hero">

          <div className="courses-hero-grid"></div>

          <div className="courses-hero-glow glow-one"></div>

          <div className="courses-hero-glow glow-two"></div>

          <div className="courses-hero-content">

            <span className="courses-eyebrow">
              LEARNSPHERE ACADEMY
            </span>

            <h1>
              Explore courses built
              for your{" "}
              <span>
                next step.
              </span>
            </h1>

            <p>
              Learn practical skills from
              industry professionals and build
              knowledge that moves your career
              forward.
            </p>

            <form
              className="courses-search"
              onSubmit={
                handleSearch
              }
            >

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search courses, skills or technologies"
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

            <div className="courses-hero-meta">

              <span>
                ✓ Expert-led learning
              </span>

              <span>
                ✓ Practical projects
              </span>

              <span>
                ✓ Certificates
              </span>

            </div>

          </div>

        </section>

        <section className="courses-content">

          <div className="courses-heading">

            <div>

              <span className="section-label">
                COURSE LIBRARY
              </span>

              <h2>
                Find the right course
                for you
              </h2>

              <p>
                Choose a learning path and
                start building real skills.
              </p>

            </div>

            <div className="course-result-count">

              <strong>
                {loading
                  ? "—"
                  : filteredCourses.length}
              </strong>

              <span>
                {filteredCourses.length ===
                1
                  ? "course available"
                  : "courses available"}
              </span>

            </div>

          </div>

          <div className="course-filters">

            <div className="course-category-list">

              {categories.map(
                (category) => (

                  <button
                    type="button"
                    key={
                      category
                    }
                    className={
                      selectedCategory ===
                      category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleCategoryChange(
                        category
                      )
                    }
                  >
                    {category}
                  </button>

                )
              )}

            </div>

            <select
              className="course-level-select"
              value={
                selectedLevel
              }
              onChange={(
                event
              ) =>
                setSelectedLevel(
                  event.target
                    .value
                )
              }
            >
              <option>
                All Levels
              </option>

              <option>
                Beginner
              </option>

              <option>
                Intermediate
              </option>

              <option>
                Advanced
              </option>
            </select>

          </div>

          {loading ? (
            <div className="courses-empty">

              <div>
                📚
              </div>

              <h3>
                Loading courses...
              </h3>

              <p>
                Fetching the latest courses
                from LearnSphere.
              </p>

            </div>
          ) : error ? (
            <div className="courses-empty">

              <div>
                !
              </div>

              <h3>
                Unable to load courses
              </h3>

              <p>
                {error}
              </p>

            </div>
          ) : filteredCourses.length >
            0 ? (
            <div className="courses-grid">

              {filteredCourses.map(
                (course) => {

                  const courseId =
                    getCourseId(
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

                  const tags =
                    getTags(
                      course
                    )

                  const lessonCount =
                    getLessonCount(
                      course
                    )

                  return (
                    <article
                      className="course-market-card"
                      key={
                        courseId
                      }
                    >

                      <div className="market-course-image">

                        <div className="market-image-glow"></div>

                        <img
                          src={
                            image
                          }
                          alt={
                            course.title ||
                            "Course"
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "https://cdn.simpleicons.org/react/61DAFB"
                          }}
                        />

                        <span className="market-level">
                          {level}
                        </span>

                      </div>

                      <div className="market-course-body">

                        <div className="market-tags">

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

                        <h3>
                          {course.title}
                        </h3>

                        <p className="market-instructor">
                          Instructor{" "}
                          <strong>
                            {instructor}
                          </strong>
                        </p>

                        <div className="market-course-stats">

                          <span>
                            ★ 4.9
                          </span>

                          <span>
                            {lessonCount}{" "}
                            lessons
                          </span>

                        </div>

                        <div className="market-course-bottom">

                          <div>

                            <strong>
                              ₹
                              {Number(
                                course.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>

                          <button
                            type="button"
                            className="view-course-btn"
                            onClick={() =>
                              handleViewCourse(
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
          ) : (
            <div className="courses-empty">

              <div>
                ⌕
              </div>

              <h3>
                No courses found
              </h3>

              <p>
                Try another course name, skill,
                category or level.
              </p>

              <button
                type="button"
                onClick={
                  resetFilters
                }
              >
                Reset Filters
              </button>

            </div>
          )}

        </section>

        <section className="courses-learning-banner">

          <div>

            <span className="section-label">
              START YOUR JOURNEY
            </span>

            <h2>
              Build skills that create
              opportunities.
            </h2>

            <p>
              Learn at your pace with structured
              courses, practical projects and
              expert guidance.
            </p>

          </div>

          <button
            type="button"
            onClick={
              handleStartLearning
            }
          >
            Start Learning →
          </button>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Courses
