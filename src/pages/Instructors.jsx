import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const fallbackImages = {
  default:
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
}

const fallbackInstructors = [
  {
    id: "arjun",
    name: "Arjun Sharma",
    expertise: "MERN Stack Developer",
    experience: "8+ Years",
    studentCount: 12500,
    courseCount: 6,
    photo:
      "https://c.superprof.com/i/a/22599685/10692784/600/20220924155851/senior-software-engineer-jahre-berufserfahrung-gibt-individuelles-mentoring-laravel-webentwicklung-erwachsene.jpg",
    bio:
      "Full-stack developer and instructor focused on modern JavaScript, React, Node.js and scalable web applications.",
    skills: ["React", "Node.js", "MongoDB"],
    courses: [
      { category: "Web Development" }
    ]
  },
  {
    id: "ananya",
    name: "Ananya Rao",
    expertise: "Frontend Specialist",
    experience: "7+ Years",
    studentCount: 9800,
    courseCount: 5,
    photo:
      "https://www.cs.princeton.edu/courses/archive/spring24/cos432/images/maria-photo.jpg",
    bio:
      "Frontend specialist helping learners build responsive, accessible and high-quality interfaces with modern technologies.",
    skills: ["React", "JavaScript", "CSS"],
    courses: [
      { category: "Web Development" }
    ]
  },
  {
    id: "rahul",
    name: "Rahul Mehta",
    expertise: "Data Scientist",
    experience: "9+ Years",
    studentCount: 15700,
    courseCount: 7,
    photo:
      "https://files.gotocon.com/uploads/portraits/799/square_medium/michele_angioni_1569346018.jpg",
    bio:
      "Data scientist and educator specializing in Python, machine learning, data analysis and practical AI solutions.",
    skills: ["Python", "Pandas", "Machine Learning"],
    courses: [
      { category: "Data Science" }
    ]
  },
  {
    id: "priya",
    name: "Priya Nair",
    expertise: "Product Designer",
    experience: "6+ Years",
    studentCount: 8200,
    courseCount: 4,
    photo:
      "https://profile-images.xing.com/images/dbc28e9e1ba1f7918dc3954850c6f727-1/birva-mandalia.1024x1024.jpg",
    bio:
      "Product designer passionate about user research, design systems and creating meaningful digital experiences.",
    skills: ["Figma", "UX Research", "Prototyping"],
    courses: [
      { category: "UI / UX Design" }
    ]
  },
  {
    id: "vikram",
    name: "Vikram Singh",
    expertise: "AI Engineer",
    experience: "8+ Years",
    studentCount: 7400,
    courseCount: 5,
    photo:
      "https://cdn.mentorcruise.com/cdn-cgi/image/width%3D504%2Cformat%3Dauto/https%3A/cdn.mentorcruise.com/cache/9890350416cd83e8743d7c3e28439389/7e7e80c4c1b31715/54fe82b7e007d6a192725100ebfcb9d2.jpg",
    bio:
      "AI engineer focused on machine learning fundamentals, intelligent systems and practical applications of AI.",
    skills: ["AI", "Python", "Machine Learning"],
    courses: [
      { category: "Artificial Intelligence" }
    ]
  },
  {
    id: "karan",
    name: "Karan Verma",
    expertise: "Cloud & DevOps Engineer",
    experience: "10+ Years",
    studentCount: 6900,
    courseCount: 6,
    photo:
      "https://profile-images.xing.com/images/b753d7ebb1ea6716ba6623158d8eb171-2/ooi-siang-tan.1024x1024.jpg",
    bio:
      "Cloud and DevOps professional teaching scalable infrastructure, deployment workflows and modern cloud technologies.",
    skills: ["AWS", "Docker", "DevOps"],
    courses: [
      { category: "Cloud & DevOps" }
    ]
  }
]

function mergeInstructors(liveInstructors) {
  const fallbackMap = new Map(
    fallbackInstructors.map((instructor) => [
      instructor.name.toLowerCase(),
      instructor
    ])
  )

  const mergedInstructors = []

  liveInstructors.forEach((instructor) => {
    const key = String(
      instructor?.name || ""
    ).toLowerCase()

    const base =
      fallbackMap.get(key) || {}

    mergedInstructors.push({
      ...base,
      ...instructor,
      id: String(
        instructor?.id ||
          instructor?._id ||
          base.id ||
          key
      ),
      name:
        instructor?.name ||
        base.name ||
        "LearnSphere Instructor",
      expertise:
        instructor?.expertise ||
        base.expertise ||
        "Industry Professional",
      experience:
        instructor?.experience ||
        base.experience ||
        "—",
      studentCount:
        instructor?.studentCount ??
        base.studentCount ??
        0,
      courseCount:
        instructor?.courseCount ??
        base.courseCount ??
        0,
      photo:
        instructor?.photo ||
        base.photo ||
        "",
      bio:
        instructor?.bio ||
        base.bio ||
        "Learn practical skills from an experienced LearnSphere instructor.",
      skills:
        Array.isArray(instructor?.skills) &&
        instructor.skills.length > 0
          ? instructor.skills
          : base.skills || [],
      courses:
        Array.isArray(instructor?.courses) &&
        instructor.courses.length > 0
          ? instructor.courses
          : base.courses || []
    })

    if (key) {
      fallbackMap.delete(key)
    }
  })

  return [
    ...mergedInstructors,
    ...fallbackMap.values()
  ]
}

function getInstructorRole(instructor) {
  if (instructor.expertise) {
    return instructor.expertise
  }

  const firstCourse =
    Array.isArray(instructor.courses) &&
    instructor.courses.length > 0
      ? instructor.courses[0]
      : null

  return (
    firstCourse?.category ||
    "Industry Professional"
  )
}

function getInstructorCategory(instructor) {
  if (
    Array.isArray(instructor.courses) &&
    instructor.courses.length > 0
  ) {
    return (
      instructor.courses[0]?.category ||
      "Other"
    )
  }

  return "Other"
}

function getInstructorSkills(instructor) {
  if (
    Array.isArray(instructor.skills) &&
    instructor.skills.length > 0
  ) {
    return instructor.skills.slice(0, 3)
  }

  const skills = []

  if (instructor.expertise) {
    skills.push(
      instructor.expertise
    )
  }

  if (
    Array.isArray(instructor.courses)
  ) {
    instructor.courses.forEach(
      (course) => {
        if (
          course.category &&
          !skills.includes(
            course.category
          )
        ) {
          skills.push(
            course.category
          )
        }
      }
    )
  }

  return skills.slice(
    0,
    3
  )
}

function formatStudents(count) {
  const value = Number(
    count || 0
  )

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(
      value >= 10000
        ? 0
        : 1
    )}K`
  }

  return String(value)
}

function getExperience(
  experience
) {
  if (
    experience ===
    undefined ||
    experience === null ||
    experience === ""
  ) {
    return "—"
  }

  const value = String(
    experience
  )

  return value
    .toLowerCase()
    .includes("year")
    ? value
    : `${value} Years`
}

function Instructors() {
  const [
    instructors,
    setInstructors
  ] = useState(fallbackInstructors)

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    error,
    setError
  ] = useState("")

  const [
    searchTerm,
    setSearchTerm
  ] = useState("")

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState("All")

  useEffect(() => {
    let cancelled = false

    async function loadInstructors() {
      try {
        setLoading(
          true
        )
        setError("")

        const response =
          await fetch(
            "http://localhost:5000/api/instructors"
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load instructors."
          )
        }

        const backendInstructors =
          Array.isArray(
            data
          )
            ? data
            : Array.isArray(
                data.instructors
              )
              ? data.instructors
              : []

        if (
          !cancelled
        ) {
          setInstructors(
            mergeInstructors(
              backendInstructors
            )
          )
        }
      } catch (loadError) {
        console.error(
          "Instructors loading error:",
          loadError
        )

        if (
          !cancelled
        ) {
          setInstructors(
            fallbackInstructors
          )
          setError("")
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          )
        }
      }
    }

    loadInstructors()

    return () => {
      cancelled = true
    }
  }, [])

  const categories =
    useMemo(() => {
      const values =
        instructors
          .map(
            (instructor) =>
              getInstructorCategory(
                instructor
              )
          )
          .filter(Boolean)

      return [
        "All",
        ...Array.from(
          new Set(values)
        ).sort()
      ]
    }, [instructors])

  const filteredInstructors =
    useMemo(() => {
      const search =
        searchTerm
          .toLowerCase()
          .trim()

      return instructors.filter(
        (instructor) => {
          const role =
            getInstructorRole(
              instructor
            )

          const category =
            getInstructorCategory(
              instructor
            )

          const skills =
            getInstructorSkills(
              instructor
            )

          const matchesSearch =
            !search ||
            instructor.name
              ?.toLowerCase()
              .includes(
                search
              ) ||
            role
              .toLowerCase()
              .includes(
                search
              ) ||
            category
              .toLowerCase()
              .includes(
                search
              ) ||
            instructor.bio
              ?.toLowerCase()
              .includes(
                search
              ) ||
            skills.some(
              (skill) =>
                skill
                  .toLowerCase()
                  .includes(
                    search
                  )
            )

          const matchesCategory =
            selectedCategory ===
              "All" ||
            category ===
              selectedCategory

          return (
            matchesSearch &&
            matchesCategory
          )
        }
      )
    }, [
      instructors,
      searchTerm,
      selectedCategory
    ])

  const totalStudents =
    instructors.reduce(
      (
        total,
        instructor
      ) =>
        total +
        Number(
          instructor.studentCount ||
            0
        ),
      0
    )

  const totalCourses =
    instructors.reduce(
      (
        total,
        instructor
      ) =>
        total +
        Number(
          instructor.courseCount ||
            0
        ),
      0
    )

  return (
    <>
      <Navbar />

      <main className="instructors-page">

        <section className="instructors-hero">

          <div className="instructors-hero-content">

            <span className="instructors-eyebrow">
              LEARN FROM EXPERTS
            </span>

            <h1>
              Learn from industry
              <span>
                {" "}
                professionals.
              </span>
            </h1>

            <p>
              Meet experienced instructors
              who bring real-world knowledge,
              practical skills and proven
              expertise into every
              LearnSphere course.
            </p>

          </div>

          <div className="instructors-hero-stats">

            <div>
              <strong>
                {instructors.length}
              </strong>

              <span>
                Expert instructors
              </span>
            </div>

            <div>
              <strong>
                {formatStudents(
                  totalStudents
                )}
              </strong>

              <span>
                Active learners
              </span>
            </div>

            <div>
              <strong>
                {totalCourses}
              </strong>

              <span>
                Published courses
              </span>
            </div>

          </div>

        </section>

        <section className="instructors-section">

          <div className="instructors-toolbar">

            <div className="instructors-section-heading">

              <span>
                OUR INSTRUCTORS
              </span>

              <h2>
                Meet your instructors
              </h2>

              <p>
                Learn directly from
                professionals with practical
                experience across today's
                most in-demand skills.
              </p>

            </div>

            <div className="instructors-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search instructors or skills..."
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
              />

            </div>

          </div>

          <div className="instructor-filters">

            {categories.map(
              (
                category
              ) => (
                <button
                  key={
                    category
                  }
                  type="button"
                  className={
                    selectedCategory ===
                    category
                      ? "instructor-filter active"
                      : "instructor-filter"
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  {
                    category
                  }
                </button>
              )
            )}

          </div>

          {loading && (
            <div className="instructors-empty">

              <div>
                ⏳
              </div>

              <h3>
                Loading instructors...
              </h3>

              <p>
                Please wait while the
                latest instructor profiles
                are loaded.
              </p>

            </div>
          )}

          {!loading &&
            error && (
              <div className="instructors-empty">

                <div>
                  !
                </div>

                <h3>
                  Unable to load instructors
                </h3>

                <p>
                  {error}
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            filteredInstructors.length >
              0 && (
              <div className="instructors-grid">

                {filteredInstructors.map(
                  (
                    instructor
                  ) => {
                    const category =
                      getInstructorCategory(
                        instructor
                      )

                    const role =
                      getInstructorRole(
                        instructor
                      )

                    const skills =
                      getInstructorSkills(
                        instructor
                      )

                    const students =
                      formatStudents(
                        instructor.studentCount
                      )

                    const courses =
                      Number(
                        instructor.courseCount ||
                          0
                      )

                    const experience =
                      getExperience(
                        instructor.experience
                      )

                    const image =
                      instructor.photo ||
                      fallbackImages.default

                    return (
                      <article
                        className="instructor-card"
                        key={
                          instructor.id
                        }
                      >

                        <div className="instructor-card-top">

                          <div className="instructor-avatar">

                            <img
                              src={
                                image
                              }
                              alt={
                                instructor.name
                              }
                              onError={(
                                event
                              ) => {
                                event.currentTarget.src =
                                  fallbackImages.default
                              }}
                            />

                          </div>

                          <div className="instructor-rating">

                            <span>
                              ★
                            </span>

                            4.9

                          </div>

                        </div>

                        <div className="instructor-card-content">

                          <span className="instructor-category">
                            {
                              category
                            }
                          </span>

                          <h3>
                            {
                              instructor.name
                            }
                          </h3>

                          <p className="instructor-role">
                            {
                              role
                            }
                          </p>

                          <p className="instructor-bio">
                            {
                              instructor.bio ||
                                "Learn practical skills from an experienced LearnSphere instructor."
                            }
                          </p>

                          <div className="instructor-skills">

                            {skills.map(
                              (
                                skill
                              ) => (
                                <span
                                  key={
                                    skill
                                  }
                                >
                                  {
                                    skill
                                  }
                                </span>
                              )
                            )}

                          </div>

                          <div className="instructor-card-stats">

                            <div>

                              <strong>
                                {
                                  students
                                }
                              </strong>

                              <span>
                                Students
                              </span>

                            </div>

                            <div>

                              <strong>
                                {
                                  courses
                                }
                              </strong>

                              <span>
                                Courses
                              </span>

                            </div>

                            <div>

                              <strong>
                                {
                                  experience
                                }
                              </strong>

                              <span>
                                Experience
                              </span>

                            </div>

                          </div>

                        </div>

                        <button
                          type="button"
                          className="instructor-profile-btn"
                          onClick={() => {
                            window.location.assign(
                              `/instructor-details?instructor=${encodeURIComponent(
                                instructor.id
                              )}`
                            )
                          }}
                        >
                          View Profile

                          <span>
                            →
                          </span>

                        </button>

                      </article>
                    )
                  }
                )}

              </div>
            )}

          {!loading &&
            !error &&
            filteredInstructors.length ===
              0 && (
              <div className="instructors-empty">

                <div>
                  ⌕
                </div>

                <h3>
                  No instructors found
                </h3>

                <p>
                  Try searching for another
                  instructor, skill or
                  category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory(
                      "All"
                    )
                  }}
                >
                  Reset Filters
                </button>

              </div>
            )}

        </section>

        <section className="instructor-cta">

          <div>

            <span>
              START YOUR LEARNING JOURNEY
            </span>

            <h2>
              Learn from people who
              <strong>
                {" "}
                build in the real world.
              </strong>
            </h2>

            <p>
              Explore expert-led courses
              and develop practical skills
              that you can apply to real
              projects.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              window.location.assign(
                "/courses"
              )
            }}
          >
            Explore Courses

            <span>
              →
            </span>

          </button>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Instructors
