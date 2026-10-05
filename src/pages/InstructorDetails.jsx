import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const fallbackImage =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

const fallbackInstructors = {
  arjun: {
    id: "arjun",
    name: "Arjun Sharma",
    expertise: "MERN Stack Developer",
    experience: "8+ Years",
    studentCount: 12500,
    courseCount: 6,
    photo: "https://c.superprof.com/i/a/22599685/10692784/600/20220924155851/senior-software-engineer-jahre-berufserfahrung-gibt-individuelles-mentoring-laravel-webentwicklung-erwachsene.jpg",
    bio: "Full-stack developer and instructor focused on modern JavaScript, React, Node.js and scalable web applications.",
    courses: [{ courseId: "mern", title: "MERN Stack Development", category: "Web Development", duration: "45+ hours", modules: [], image: "https://cdn.simpleicons.org/react/61DAFB" }]
  },
  ananya: {
    id: "ananya",
    name: "Ananya Rao",
    expertise: "Frontend Specialist",
    experience: "7+ Years",
    studentCount: 9800,
    courseCount: 5,
    photo: "https://www.cs.princeton.edu/courses/archive/spring24/cos432/images/maria-photo.jpg",
    bio: "Frontend specialist helping learners build responsive, accessible and high-quality interfaces with modern technologies.",
    courses: [{ courseId: "frontend", title: "Frontend Development with React", category: "Web Development", duration: "35+ hours", modules: [], image: "https://cdn.simpleicons.org/react/61DAFB" }]
  },
  rahul: {
    id: "rahul",
    name: "Rahul Mehta",
    expertise: "Data Scientist",
    experience: "9+ Years",
    studentCount: 15700,
    courseCount: 7,
    photo: "https://files.gotocon.com/uploads/portraits/799/square_medium/michele_angioni_1569346018.jpg",
    bio: "Data scientist and educator specializing in Python, machine learning, data analysis and practical AI solutions.",
    courses: [{ courseId: "datascience", title: "Data Science with Python", category: "Data Science", duration: "40+ hours", modules: [], image: "https://cdn.simpleicons.org/python/3776AB" }]
  },
  priya: {
    id: "priya",
    name: "Priya Nair",
    expertise: "Product Designer",
    experience: "6+ Years",
    studentCount: 8200,
    courseCount: 4,
    photo: "https://profile-images.xing.com/images/dbc28e9e1ba1f7918dc3954850c6f727-1/birva-mandalia.1024x1024.jpg",
    bio: "Product designer passionate about user research, design systems and creating meaningful digital experiences.",
    courses: [{ courseId: "uiux", title: "UI/UX Design Masterclass", category: "UI / UX Design", duration: "30+ hours", modules: [], image: "https://cdn.simpleicons.org/figma/F24E1E" }]
  },
  vikram: {
    id: "vikram",
    name: "Vikram Singh",
    expertise: "AI Engineer",
    experience: "8+ Years",
    studentCount: 7400,
    courseCount: 5,
    photo: "https://cdn.mentorcruise.com/cdn-cgi/image/width%3D504%2Cformat%3Dauto/https%3A/cdn.mentorcruise.com/cache/9890350416cd83e8743d7c3e28439389/7e7e80c4c1b31715/54fe82b7e007d6a192725100ebfcb9d2.jpg",
    bio: "AI engineer focused on machine learning fundamentals, intelligent systems and practical applications of AI.",
    courses: [{ courseId: "ai", title: "Artificial Intelligence Fundamentals", category: "Artificial Intelligence", duration: "32+ hours", modules: [], image: "https://cdn.simpleicons.org/python/3776AB" }]
  },
  karan: {
    id: "karan",
    name: "Karan Verma",
    expertise: "Cloud & DevOps Engineer",
    experience: "10+ Years",
    studentCount: 6900,
    courseCount: 6,
    photo: "https://profile-images.xing.com/images/b753d7ebb1ea6716ba6623158d8eb171-2/ooi-siang-tan.1024x1024.jpg",
    bio: "Cloud and DevOps professional teaching scalable infrastructure, deployment workflows and modern cloud technologies.",
    courses: [{ courseId: "cloud", title: "Cloud & DevOps Engineering", category: "Cloud & DevOps", duration: "38+ hours", modules: [], image: "https://cdn.simpleicons.org/docker/2496ED" }]
  }
}

function formatStudents(count) {
  const value = Number(count || 0)

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(value >= 10000 ? 0 : 1)}K`
  }

  return String(value)
}

function formatExperience(experience) {
  if (
    experience === undefined ||
    experience === null ||
    experience === ""
  ) {
    return "—"
  }

  const value = String(experience)

  if (
    value.toLowerCase().includes("year")
  ) {
    return value
  }

  return `${value} Years`
}

function getCourseLevel(course) {
  const lessons = Array.isArray(
    course?.modules
  )
    ? course.modules.reduce(
        (total, module) =>
          total +
          (Array.isArray(
            module?.lessons
          )
            ? module.lessons.length
            : 0),
        0
      )
    : 0

  if (lessons >= 15) {
    return "Advanced"
  }

  if (lessons >= 8) {
    return "Intermediate"
  }

  return "Beginner"
}

function getCourseDuration(course) {
  if (course?.duration) {
    return course.duration
  }

  const lessonCount =
    Array.isArray(course?.modules)
      ? course.modules.reduce(
          (total, module) =>
            total +
            (Array.isArray(
              module?.lessons
            )
              ? module.lessons.length
              : 0),
          0
        )
      : 0

  if (!lessonCount) {
    return "Self-paced"
  }

  return `${lessonCount}+ lessons`
}

function InstructorDetails() {
  const params =
    new URLSearchParams(
      window.location.search
    )

  const instructorId =
    params.get("instructor")

  const [instructor, setInstructor] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  useEffect(() => {
    let cancelled = false

    async function loadInstructor() {
      if (!instructorId) {
        setError(
          "Instructor not specified."
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            `http://localhost:5000/api/instructors/${encodeURIComponent(
              instructorId
            )}`
          )

        const data =
          await response.json()

        if (!response.ok) {
          const fallbackInstructor =
            fallbackInstructors[instructorId]

          if (!cancelled && fallbackInstructor) {
            setInstructor(fallbackInstructor)
            setError("")
            return
          }

          throw new Error(
            data.message ||
              "Unable to load instructor."
          )
        }

        if (!cancelled) {
          const loadedInstructor =
            data?.instructor ||
            data ||
            fallbackInstructors[instructorId]

          if (loadedInstructor) {
            setInstructor(loadedInstructor)
            setError("")
            return
          }

          throw new Error(
            "Unable to load instructor."
          )
        }
      } catch (loadError) {
        console.error(
          "Instructor details loading error:",
          loadError
        )

        if (!cancelled) {
          const fallbackInstructor =
            fallbackInstructors[instructorId]

          if (fallbackInstructor) {
            setInstructor(fallbackInstructor)
            setError("")
          } else {
            setError(
              loadError.message ||
                "Unable to load instructor."
            )
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInstructor()

    return () => {
      cancelled = true
    }
  }, [instructorId])

  const skills = useMemo(() => {
    if (!instructor) {
      return []
    }

    const values = []

    if (
      instructor.expertise
    ) {
      values.push(
        instructor.expertise
      )
    }

    if (
      Array.isArray(
        instructor.courses
      )
    ) {
      instructor.courses.forEach(
        (course) => {
          if (
            course.category &&
            !values.includes(
              course.category
            )
          ) {
            values.push(
              course.category
            )
          }
        }
      )
    }

    return values.slice(
      0,
      6
    )
  }, [instructor])

  function goToInstructors() {
    window.location.assign(
      "/instructors"
    )
  }

  function goToCourses() {
    window.location.assign(
      "/courses"
    )
  }

  function openCourse(courseId) {
    window.location.assign(
      `/course-details?course=${encodeURIComponent(
        courseId
      )}`
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="instructor-details-page">

          <section className="instructor-details-hero">

            <div className="instructor-details-container">

              <button
                type="button"
                className="instructor-back-btn"
                onClick={
                  goToInstructors
                }
              >
                ← Back to Instructors
              </button>

              <div className="instructor-profile-header">

                <div className="instructor-profile-main">

                  <span className="instructor-profile-category">
                    LEARNSPHERE INSTRUCTOR
                  </span>

                  <h1>
                    Loading instructor...
                  </h1>

                  <p>
                    Loading the latest instructor profile.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  if (
    !instructor ||
    error
  ) {
    return (
      <>
        <Navbar />

        <main className="instructor-details-page">

          <section className="instructor-details-hero">

            <div className="instructor-details-container">

              <button
                type="button"
                className="instructor-back-btn"
                onClick={
                  goToInstructors
                }
              >
                ← Back to Instructors
              </button>

              <div className="instructor-profile-header">

                <div className="instructor-profile-main">

                  <span className="instructor-profile-category">
                    INSTRUCTOR
                  </span>

                  <h1>
                    Instructor Not Found
                  </h1>

                  <p>
                    {error ||
                      "The requested instructor could not be found."}
                  </p>

                </div>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  const instructorName =
    instructor.name ||
    "LearnSphere Instructor"

  const instructorRole =
    instructor.expertise ||
    instructor.courses?.[0]
      ?.category ||
    "Industry Professional"

  const instructorCategory =
    instructor.courses?.[0]
      ?.category ||
    "Professional Skills"

  const image =
    instructor.photo ||
    fallbackImage

  const experience =
    formatExperience(
      instructor.experience
    )

  const students =
    formatStudents(
      instructor.studentCount
    )

  const courseCount =
    Number(
      instructor.courseCount ||
        instructor.courses?.length ||
        0
    )

  const courses =
    Array.isArray(
      instructor.courses
    )
      ? instructor.courses
      : []

  return (
    <>
      <Navbar />

      <main className="instructor-details-page">

        <section className="instructor-details-hero">

          <div className="instructor-details-container">

            <button
              type="button"
              className="instructor-back-btn"
              onClick={
                goToInstructors
              }
            >
              ← Back to Instructors
            </button>

            <div className="instructor-profile-header">

              <div className="instructor-profile-avatar">

                <img
                  src={image}
                  alt={instructorName}
                  onError={(
                    event
                  ) => {
                    event.currentTarget.src =
                      fallbackImage
                  }}
                />

              </div>

              <div className="instructor-profile-main">

                <span className="instructor-profile-category">
                  {
                    instructorCategory
                  }
                </span>

                <h1>
                  {
                    instructorName
                  }
                </h1>

                <h2>
                  {
                    instructorRole
                  }
                </h2>

                <p>
                  {instructor.bio ||
                    "Experienced LearnSphere instructor focused on practical and structured learning."}
                </p>

                <div className="instructor-profile-rating">

                  <span>
                    ★
                  </span>

                  <strong>
                    4.9
                  </strong>

                  <span className="rating-text">
                    Instructor rating
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="instructor-details-content">

          <div className="instructor-details-container">

            <div className="instructor-stat-grid">

              <div className="instructor-stat-card">

                <strong>
                  {
                    experience
                  }
                </strong>

                <span>
                  Experience
                </span>

              </div>

              <div className="instructor-stat-card">

                <strong>
                  {
                    students
                  }
                </strong>

                <span>
                  Students
                </span>

              </div>

              <div className="instructor-stat-card">

                <strong>
                  {
                    courseCount
                  }
                </strong>

                <span>
                  Courses
                </span>

              </div>

              <div className="instructor-stat-card">

                <strong>
                  4.9
                </strong>

                <span>
                  Rating
                </span>

              </div>

            </div>

            <div className="instructor-details-layout">

              <div className="instructor-details-left">

                <section className="instructor-details-panel">

                  <span className="details-section-label">
                    ABOUT THE INSTRUCTOR
                  </span>

                  <h2>
                    Learn from practical experience
                  </h2>

                  <p>
                    {instructor.bio ||
                      "This instructor brings practical industry knowledge to LearnSphere learners."}
                  </p>

                  <p>
                    Explore the instructor's
                    courses below to learn
                    through structured lessons,
                    practical concepts and
                    real-world applications.
                  </p>

                </section>

                <section className="instructor-details-panel">

                  <span className="details-section-label">
                    EXPERTISE
                  </span>

                  <h2>
                    Areas of expertise
                  </h2>

                  {skills.length >
                  0 ? (
                    <div className="instructor-expertise-grid">

                      {skills.map(
                        (
                          skill
                        ) => (
                          <div
                            className="instructor-expertise-item"
                            key={
                              skill
                            }
                          >

                            <span>
                              ✓
                            </span>

                            {
                              skill
                            }

                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <p>
                      Instructor expertise
                      details are available
                      through the published
                      courses.
                    </p>
                  )}

                </section>

              </div>

              <aside className="instructor-details-right">

                <div className="instructor-quick-card">

                  <span className="details-section-label">
                    INSTRUCTOR PROFILE
                  </span>

                  <h3>
                    {
                      instructorName
                    }
                  </h3>

                  <p>
                    {
                      instructorRole
                    }
                  </p>

                  <div className="quick-detail">

                    <span>
                      Experience
                    </span>

                    <strong>
                      {
                        experience
                      }
                    </strong>

                  </div>

                  <div className="quick-detail">

                    <span>
                      Students
                    </span>

                    <strong>
                      {
                        students
                      }
                    </strong>

                  </div>

                  <div className="quick-detail">

                    <span>
                      Courses
                    </span>

                    <strong>
                      {
                        courseCount
                      }
                    </strong>

                  </div>

                  <div className="quick-detail">

                    <span>
                      Rating
                    </span>

                    <strong>
                      ★ 4.9
                    </strong>

                  </div>

                  <button
                    type="button"
                    onClick={
                      goToCourses
                    }
                  >
                    Explore All Courses

                    <span>
                      →
                    </span>

                  </button>

                </div>

              </aside>

            </div>

            <section className="instructor-courses-section">

              <div className="instructor-courses-heading">

                <div>

                  <span className="details-section-label">
                    COURSES BY{" "}
                    {
                      instructorName.toUpperCase()
                    }
                  </span>

                  <h2>
                    Featured courses
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={
                    goToCourses
                  }
                >
                  View All Courses →
                </button>

              </div>

              {courses.length >
              0 ? (
                <div className="instructor-course-grid">

                  {courses.map(
                    (
                      course
                    ) => {
                      const level =
                        getCourseLevel(
                          course
                        )

                      const duration =
                        getCourseDuration(
                          course
                        )

                      return (
                        <article
                          className="instructor-course-card"
                          key={
                            course._id ||
                            course.courseId
                          }
                        >

                          <div className="instructor-course-visual">

                            <img
                              src={
                                course.image ||
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
                                  image
                              }}
                            />

                          </div>

                          <div className="instructor-course-content">

                            <div className="instructor-course-meta">

                              <span>
                                {
                                  level
                                }
                              </span>

                              <span>
                                ★ 4.9
                              </span>

                            </div>

                            <h3>
                              {
                                course.title ||
                                  "LearnSphere Course"
                              }
                            </h3>

                            <p>
                              {
                                course.description ||
                                  "Learn practical concepts through structured lessons and hands-on learning."
                              }
                            </p>

                            <div className="instructor-course-bottom">

                              <span>
                                {
                                  duration
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  openCourse(
                                    course.courseId
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
                <div className="instructors-empty">

                  <div>
                    📚
                  </div>

                  <h3>
                    No courses published yet
                  </h3>

                  <p>
                    Courses created by this
                    instructor will appear here.
                  </p>

                </div>
              )}

            </section>

            <section className="instructor-learning-cta">

              <div>

                <span>
                  READY TO START?
                </span>

                <h2>
                  Build your next skill with
                  <strong>
                    {" "}
                    LearnSphere.
                  </strong>
                </h2>

                <p>
                  Explore structured courses
                  and learn from experienced
                  professionals.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  goToCourses
                }
              >
                Explore Courses

                <span>
                  →
                </span>

              </button>

            </section>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default InstructorDetails