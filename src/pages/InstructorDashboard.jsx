import {
  useCallback,
  useEffect,
  useState
} from "react"

import Navbar from "../components/Navbar"

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("")
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        const maxSize = 1200
        let width = image.width
        let height = image.height

        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, width, height)

        let quality = 0.8
        let dataUrl = canvas.toDataURL("image/jpeg", quality)

        while (dataUrl.length > 90000 && quality > 0.3) {
          quality -= 0.1
          dataUrl = canvas.toDataURL("image/jpeg", quality)
        }

        resolve(dataUrl)
      }

      image.onerror = () => {
        reject(new Error("Unable to read the selected image."))
      }

      image.src = reader.result
    }

    reader.onerror = () => {
      reject(new Error("Unable to read the selected image."))
    }

    reader.readAsDataURL(file)
  })
}

const emptyForm = {
  courseId: "",
  title: "",
  description: "",
  category: "",
  price: "",
  duration: "",
  image: ""
}

function InstructorDashboard() {
  const [dashboard, setDashboard] =
    useState(null)

  const [students, setStudents] =
    useState([])

  const [selectedStudent, setSelectedStudent] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [studentsLoading, setStudentsLoading] =
    useState(true)

  const [studentLoading, setStudentLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [formData, setFormData] =
    useState(emptyForm)

  const [editingCourse, setEditingCourse] =
    useState(null)

  const [contentCourse, setContentCourse] =
    useState(null)

  const [contentModules, setContentModules] =
    useState([])

  function getToken() {
    return localStorage.getItem(
      "learnsphereToken"
    )
  }

  const fetchDashboard =
    useCallback(async () => {
      const token =
        getToken()

      if (!token) {
        window.location.assign(
          "/login"
        )
        return null
      }

      const response =
        await fetch(
          "http://localhost:5000/api/instructor/dashboard",
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
        throw new Error(
          data.message ||
            "Failed to load instructor dashboard."
        )
      }

      setDashboard(data)

      return data
    }, [])

  const fetchStudents =
    useCallback(async () => {
      const token =
        getToken()

      if (!token) {
        return
      }

      setStudentsLoading(true)

      try {
        const response =
          await fetch(
            "http://localhost:5000/api/instructor/students",
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
          throw new Error(
            data.message ||
              "Unable to load students."
          )
        }

        setStudents(
          Array.isArray(
            data.students
          )
            ? data.students
            : []
        )
      } catch (studentError) {
        console.error(
          "Instructor students error:",
          studentError
        )

        setError(
          studentError.message ||
            "Unable to load students."
        )
      } finally {
        setStudentsLoading(
          false
        )
      }
    }, [])

  const fetchStudentDetails =
    useCallback(
      async (studentId) => {
        const token =
          getToken()

        if (!token) {
          return
        }

        try {
          setStudentLoading(
            true
          )
          setError("")

          const response =
            await fetch(
              `http://localhost:5000/api/instructor/students/${encodeURIComponent(
                studentId
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
            throw new Error(
              data.message ||
                "Unable to load student details."
            )
          }

          setSelectedStudent(
            data.student ||
              null
          )
        } catch (studentError) {
          console.error(
            "Student details error:",
            studentError
          )

          setError(
            studentError.message ||
              "Unable to load student details."
          )
        } finally {
          setStudentLoading(
            false
          )
        }
      },
      []
    )

  useEffect(() => {
    let cancelled = false

    async function loadPage() {
      try {
        await Promise.all([
          fetchDashboard(),
          fetchStudents()
        ])
      } catch (pageError) {
        if (!cancelled) {
          setError(
            pageError.message ||
              "Unable to load instructor dashboard."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPage()

    return () => {
      cancelled = true
    }
  }, [
    fetchDashboard,
    fetchStudents
  ])

  function handleChange(event) {
    const {
      name,
      value
    } = event.target

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    )
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const image = await readImageFile(file)

      setFormData((previous) => ({
        ...previous,
        image
      }))
    } catch (imageError) {
      setError(
        imageError.message ||
          "Unable to read the selected image."
      )
    }
  }

  function resetForm() {
    setFormData(
      emptyForm
    )

    setEditingCourse(
      null
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setSuccess("")

    try {
      const token =
        getToken()

      const response =
        await fetch(
          "http://localhost:5000/api/instructor/courses",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              courseId:
                formData.courseId.trim(),

              title:
                formData.title.trim(),

              description:
                formData.description.trim(),

              category:
                formData.category.trim(),

              price:
                Number(
                  formData.price
                ),

              duration:
                formData.duration.trim(),

              image:
                formData.image.trim(),

              modules: []
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create course."
        )
      }

      setSuccess(
        "Course created successfully."
      )

      resetForm()

      await fetchDashboard()
    } catch (submitError) {
      setError(
        submitError.message
      )
    }
  }

  function handleEdit(course) {
    setError("")
    setSuccess("")

    setEditingCourse(
      course
    )

    setFormData({
      courseId:
        course.courseId ||
        "",

      title:
        course.title ||
        "",

      description:
        course.description ||
        "",

      category:
        course.category ||
        "",

      price:
        course.price ??
        "",

      duration:
        course.duration ||
        "",

      image:
        course.image ||
        ""
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  async function handleUpdate(event) {
    event.preventDefault()

    if (!editingCourse) {
      return
    }

    setError("")
    setSuccess("")

    try {
      const token =
        getToken()

      const response =
        await fetch(
          `http://localhost:5000/api/instructor/courses/${encodeURIComponent(
            editingCourse.courseId
          )}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              title:
                formData.title.trim(),

              description:
                formData.description.trim(),

              category:
                formData.category.trim(),

              price:
                Number(
                  formData.price
                ),

              duration:
                formData.duration.trim(),

              image:
                formData.image.trim()
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update course."
        )
      }

      setSuccess(
        "Course updated successfully."
      )

      resetForm()

      await fetchDashboard()
    } catch (updateError) {
      setError(
        updateError.message
      )
    }
  }

  async function handleDelete(
    courseId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this course?"
      )

    if (!confirmed) {
      return
    }

    setError("")
    setSuccess("")

    try {
      const token =
        getToken()

      const response =
        await fetch(
          `http://localhost:5000/api/instructor/courses/${encodeURIComponent(
            courseId
          )}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete course."
        )
      }

      setSuccess(
        "Course deleted successfully."
      )

      if (
        editingCourse?.courseId ===
        courseId
      ) {
        resetForm()
      }

      if (
        contentCourse?.courseId ===
        courseId
      ) {
        setContentCourse(
          null
        )

        setContentModules(
          []
        )
      }

      await fetchDashboard()
      await fetchStudents()
    } catch (deleteError) {
      setError(
        deleteError.message
      )
    }
  }

  function handleManageContent(
    course
  ) {
    setError("")
    setSuccess("")

    setContentCourse(
      course
    )

    setContentModules(
      (course.modules ||
        []
      ).map(
        (module) => ({
          title:
            module.title ||
            "",

          lessons:
            (
              module.lessons ||
              []
            ).map(
              (lesson) => ({
                title:
                  lesson.title ||
                  "",

                videoId:
                  lesson.videoId ||
                  ""
              })
            )
        })
      )
    )

    setSelectedStudent(
      null
    )

    window.scrollTo({
      top:
        document.body
          .scrollHeight,
      behavior:
        "smooth"
    })
  }

  function handleCloseContent() {
    setContentCourse(
      null
    )

    setContentModules(
      []
    )

    setError("")
    setSuccess("")
  }

  function handleModuleTitleChange(
    moduleIndex,
    value
  ) {
    setContentModules(
      (
        currentModules
      ) =>
        currentModules.map(
          (
            module,
            index
          ) =>
            index ===
            moduleIndex
              ? {
                  ...module,
                  title:
                    value
                }
              : module
        )
    )
  }

  function handleLessonChange(
    moduleIndex,
    lessonIndex,
    field,
    value
  ) {
    setContentModules(
      (
        currentModules
      ) =>
        currentModules.map(
          (
            module,
            index
          ) => {
            if (
              index !==
              moduleIndex
            ) {
              return module
            }

            return {
              ...module,

              lessons:
                module.lessons.map(
                  (
                    lesson,
                    currentLessonIndex
                  ) =>
                    currentLessonIndex ===
                    lessonIndex
                      ? {
                          ...lesson,
                          [field]:
                            value
                        }
                      : lesson
                )
            }
          }
        )
    )
  }

  function handleAddModule() {
    setContentModules(
      (
        currentModules
      ) => [
        ...currentModules,
        {
          title: "",
          lessons: []
        }
      ]
    )
  }

  function handleRemoveModule(
    moduleIndex
  ) {
    setContentModules(
      (
        currentModules
      ) =>
        currentModules.filter(
          (
            _,
            index
          ) =>
            index !==
            moduleIndex
        )
    )
  }

  function handleAddLesson(
    moduleIndex
  ) {
    setContentModules(
      (
        currentModules
      ) =>
        currentModules.map(
          (
            module,
            index
          ) =>
            index ===
            moduleIndex
              ? {
                  ...module,

                  lessons: [
                    ...module.lessons,

                    {
                      title: "",
                      videoId: ""
                    }
                  ]
                }
              : module
        )
    )
  }

  function handleRemoveLesson(
    moduleIndex,
    lessonIndex
  ) {
    setContentModules(
      (
        currentModules
      ) =>
        currentModules.map(
          (
            module,
            index
          ) =>
            index ===
            moduleIndex
              ? {
                  ...module,

                  lessons:
                    module.lessons.filter(
                      (
                        _,
                        currentLessonIndex
                      ) =>
                        currentLessonIndex !==
                        lessonIndex
                    )
                }
              : module
        )
    )
  }

  async function handleSaveContent() {
    if (!contentCourse) {
      return
    }

    setError("")
    setSuccess("")

    try {
      const token =
        getToken()

      const response =
        await fetch(
          `http://localhost:5000/api/instructor/courses/${encodeURIComponent(
            contentCourse.courseId
          )}/content`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              modules:
                contentModules
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update course content."
        )
      }

      setSuccess(
        "Course content updated successfully."
      )

      const updatedCourse =
        data.course ||
        contentCourse

      setContentCourse(
        updatedCourse
      )

      setContentModules(
        (
          updatedCourse.modules ||
          []
        ).map(
          (module) => ({
            title:
              module.title ||
              "",

            lessons:
              (
                module.lessons ||
                []
              ).map(
                (lesson) => ({
                  title:
                    lesson.title ||
                    "",

                  videoId:
                    lesson.videoId ||
                    ""
                })
              )
          })
        )
      )

      await fetchDashboard()
    } catch (contentError) {
      setError(
        contentError.message
      )
    }
  }

  function closeStudentDetails() {
    setSelectedStudent(
      null
    )
  }

  const totalCourses =
    Number(
      dashboard?.totalCourses ||
        dashboard?.courses?.length ||
        0
    )

  const totalEnrollments =
    Number(
      dashboard?.totalEnrollments ||
        0
    )

  const activeStudents =
    students.filter(
      (student) =>
        !student.disabled
    ).length

  const totalModules =
    dashboard?.courses?.reduce(
      (
        total,
        course
      ) =>
        total +
        (
          course.modules
            ?.length ||
          0
        ),
      0
    ) || 0

  const totalLessons =
    dashboard?.courses?.reduce(
      (
        total,
        course
      ) =>
        total +
        (
          course.modules ||
          []
        ).reduce(
          (
            moduleTotal,
            module
          ) =>
            moduleTotal +
            (
              module.lessons
                ?.length ||
              0
            ),
          0
        ),
      0
    ) || 0

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="instructor-page">

          <div className="instructor-container instructor-loading">

            <div className="instructor-loading-spinner"></div>

            <p>
              Loading instructor dashboard...
            </p>

          </div>

        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="instructor-page">

        <div className="instructor-container">

          <div className="instructor-header">

            <div>

              <span className="instructor-eyebrow">
                INSTRUCTOR PANEL
              </span>

              <h1>
                Instructor Dashboard
              </h1>

              <p>
                Create, manage and organize
                your courses and students.
              </p>

            </div>

            <button
              type="button"
              className="instructor-btn instructor-btn-secondary"
              onClick={() =>
                window.location.assign(
                  "/instructor-profile"
                )
              }
            >
              Instructor Profile
            </button>

          </div>

          {error && (
            <div className="instructor-alert instructor-alert-error">
              {
                error
              }
            </div>
          )}

          {success && (
            <div className="instructor-alert instructor-alert-success">
              {
                success
              }
            </div>
          )}

          <div className="instructor-stats">

            <div className="instructor-stat-card">

              <span
                className="instructor-stat-icon"
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  lineHeight: 1
                }}
              >
                🆔
              </span>

              <div>

                <strong>
                  {
                    JSON.parse(
                      localStorage.getItem("learnsphereUser") || "{}"
                    ).name ||
                      dashboard?.instructorName ||
                      "—"
                  }
                </strong>

                <span>
                  Instructor Name
                </span>

              </div>

            </div>

            <div className="instructor-stat-card">

              <span
                className="instructor-stat-icon"
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  lineHeight: 1
                }}
              >
                📚
              </span>

              <div>

                <strong>
                  {
                    totalCourses
                  }
                </strong>

                <span>
                  Total Courses
                </span>

              </div>

            </div>

            <div className="instructor-stat-card">

              <span
                className="instructor-stat-icon"
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  lineHeight: 1
                }}
              >
                👥
              </span>

              <div>

                <strong>
                  {
                    totalEnrollments
                  }
                </strong>

                <span>
                  Total Enrollments
                </span>

              </div>

            </div>

            <div className="instructor-stat-card">

              <span
                className="instructor-stat-icon"
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  lineHeight: 1
                }}
              >
                👤
              </span>

              <div>

                <strong>
                  {
                    activeStudents
                  }
                </strong>

                <span>
                  Active Students
                </span>

              </div>

            </div>

            <div className="instructor-stat-card">

              <span
                className="instructor-stat-icon"
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  lineHeight: 1
                }}
              >
                📦
              </span>

              <div>

                <strong>
                  {
                    totalModules
                  }
                </strong>

                <span>
                  Total Modules
                </span>

              </div>

            </div>

            <div className="instructor-stat-card">

              <span
                className="instructor-stat-icon"
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  lineHeight: 1
                }}
              >
                ▶
              </span>

              <div>

                <strong>
                  {
                    totalLessons
                  }
                </strong>

                <span>
                  Total Lessons
                </span>

              </div>

            </div>

          </div>

          <section className="instructor-section">

            <div className="instructor-section-header">

              <div>

                <span className="instructor-eyebrow">
                  COURSE MANAGEMENT
                </span>

                <h2>
                  {
                    editingCourse
                      ? "Edit Course"
                      : "Add New Course"
                  }
                </h2>

              </div>

            </div>

            <form
              className="instructor-form"
              onSubmit={
                editingCourse
                  ? handleUpdate
                  : handleSubmit
              }
            >

              <div className="instructor-form-grid">

                <div className="instructor-form-group">

                  <label>
                    Course ID
                  </label>

                  <input
                    type="text"
                    name="courseId"
                    value={
                      formData.courseId
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={
                      Boolean(
                        editingCourse
                      )
                    }
                    placeholder="Example: react-masterclass"
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Course Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Example: React Masterclass"
                  />

                </div>

                <div className="instructor-form-group instructor-form-full">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                    placeholder="Enter course description"
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Web Development"
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    required
                    placeholder="0"
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={
                      formData.duration
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: 42+ hours"
                  />

                </div>

                <div className="instructor-form-group instructor-form-full">

                  <label>
                    Course Image
                  </label>

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                  />

                </div>

              </div>

              <div className="instructor-form-actions">

                <button
                  type="submit"
                  className="instructor-btn instructor-btn-primary"
                >
                  {
                    editingCourse
                      ? "Update Course"
                      : "Add Course"
                  }
                </button>

                {editingCourse && (
                  <button
                    type="button"
                    className="instructor-btn instructor-btn-secondary"
                    onClick={
                      resetForm
                    }
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </section>

          <section className="instructor-section">

            <div className="instructor-section-header">

              <div>

                <span className="instructor-eyebrow">
                  YOUR CONTENT
                </span>

                <h2>
                  My Courses
                </h2>

              </div>

            </div>

            {dashboard?.courses?.length ===
            0 ? (
              <div className="instructor-empty">

                <div className="instructor-empty-icon">
                  📚
                </div>

                <h3>
                  No courses created yet
                </h3>

                <p>
                  Create your first course
                  using the form above.
                </p>

              </div>
            ) : (
              <div className="instructor-course-grid">

                {dashboard.courses.map(
                  (
                    course
                  ) => {

                    const moduleCount =
                      course.modules
                        ?.length ||
                      0

                    const lessonCount =
                      (
                        course.modules ||
                        []
                      ).reduce(
                        (
                          total,
                          module
                        ) =>
                          total +
                          (
                            module.lessons
                              ?.length ||
                            0
                          ),
                        0
                      )

                    return (
                      <article
                        className="instructor-course-card"
                        key={
                          course._id ||
                          course.courseId
                        }
                      >

                        <div className="instructor-course-top">

                          <span className="instructor-course-category">
                            {
                              course.category ||
                                "General"
                            }
                          </span>

                          <span className="instructor-course-price">
                            ₹
                            {Number(
                              course.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                        {course.image && (
                          <div
                            style={{
                              margin:
                                "14px 0",
                              borderRadius:
                                "12px",
                              overflow:
                                "hidden"
                            }}
                          >

                            <img
                              src={
                                course.image
                              }
                              alt={
                                course.title
                              }
                              style={{
                                width:
                                  "100%",
                                height:
                                  "180px",
                                objectFit:
                                  "cover",
                                display:
                                  "block"
                              }}
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none"
                              }}
                            />

                          </div>
                        )}

                        <h3>
                          {
                            course.title
                          }
                        </h3>

                        <p className="instructor-course-id">
                          Course ID:{" "}
                          {
                            course.courseId
                          }
                        </p>

                        <p className="instructor-course-description">
                          {
                            course.description ||
                              "No description provided."
                          }
                        </p>

                        <div className="instructor-course-meta">

                          <span>
                            ⏱{" "}
                            {
                              course.duration ||
                                "Not specified"
                            }
                          </span>

                          <span>
                            📦{" "}
                            {
                              moduleCount
                            }{" "}
                            modules
                          </span>

                          <span>
                            ▶{" "}
                            {
                              lessonCount
                            }{" "}
                            lessons
                          </span>

                        </div>

                        <div className="instructor-course-actions">

                          <button
                            type="button"
                            className="instructor-btn instructor-btn-secondary"
                            onClick={() =>
                              handleEdit(
                                course
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="instructor-btn instructor-btn-content"
                            onClick={() =>
                              handleManageContent(
                                course
                              )
                            }
                          >
                            Manage Content
                          </button>

                          <button
                            type="button"
                            className="instructor-btn instructor-btn-danger"
                            onClick={() =>
                              handleDelete(
                                course.courseId
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </article>
                    )
                  }
                )}

              </div>
            )}

          </section>

          <section className="instructor-section">

            <div className="instructor-section-header">

              <div>

                <span className="instructor-eyebrow">
                  STUDENT MANAGEMENT
                </span>

                <h2>
                  My Students
                </h2>

                <p>
                  View students enrolled in
                  your approved courses and
                  review their learning progress.
                </p>

              </div>

            </div>

            {studentsLoading ? (
              <div className="instructor-empty">

                <h3>
                  Loading students...
                </h3>

              </div>
            ) : students.length ===
              0 ? (
              <div className="instructor-empty">

                <div className="instructor-empty-icon">
                  👥
                </div>

                <h3>
                  No students yet
                </h3>

                <p>
                  Students will appear here
                  after they are enrolled in
                  your approved courses.
                </p>

              </div>
            ) : (
              <div className="instructor-course-grid">

                {students.map(
                  (
                    student
                  ) => (
                    <article
                      className="instructor-course-card"
                      key={
                        student.id
                      }
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap:
                            "14px",
                          marginBottom:
                            "16px"
                        }}
                      >

                        <div
                          style={{
                            width:
                              "58px",
                            height:
                              "58px",
                            borderRadius:
                              "50%",
                            overflow:
                              "hidden",
                            flexShrink:
                              0,
                            background:
                              "#eeeeee",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center"
                          }}
                        >

                          {student.photo ? (
                            <img
                              src={
                                student.photo
                              }
                              alt={
                                student.name
                              }
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover"
                              }}
                            />
                          ) : (
                            <span>
                              👤
                            </span>
                          )}

                        </div>

                        <div>

                          <h3
                            style={{
                              margin:
                                0
                            }}
                          >
                            {
                              student.name
                            }
                          </h3>

                          <p
                            style={{
                              margin:
                                "4px 0 0"
                            }}
                          >
                            {
                              student.email
                            }
                          </p>

                        </div>

                      </div>

                      <div className="instructor-course-meta">

                        <span>
                          📚{" "}
                          {
                            student.enrollmentCount ||
                              0
                          }{" "}
                          courses
                        </span>

                        <span>
                          👤{" "}
                          {
                            student.disabled
                              ? "Disabled"
                              : "Active"
                          }
                        </span>

                      </div>

                      <p>
                        Joined:{" "}
                        {student.createdAt
                          ? new Date(
                              student.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day:
                                  "2-digit",
                                month:
                                  "short",
                                year:
                                  "numeric"
                              }
                            )
                          : "—"}
                      </p>

                      <button
                        type="button"
                        className="instructor-btn instructor-btn-content"
                        onClick={() =>
                          fetchStudentDetails(
                            student.id
                          )
                        }
                      >
                        View Student Details
                      </button>

                    </article>
                  )
                )}

              </div>
            )}

          </section>

          {selectedStudent && (
            <section className="instructor-section">

              <div className="instructor-section-header">

                <div>

                  <span className="instructor-eyebrow">
                    STUDENT DETAILS
                  </span>

                  <h2>
                    {
                      selectedStudent.name
                    }
                  </h2>

                  <p>
                    {
                      selectedStudent.email
                    }
                  </p>

                </div>

                <button
                  type="button"
                  className="instructor-btn instructor-btn-secondary"
                  onClick={
                    closeStudentDetails
                  }
                >
                  Close
                </button>

              </div>

              {studentLoading ? (
                <div className="instructor-empty">

                  <h3>
                    Loading student details...
                  </h3>

                </div>
              ) : (
                <>

                  <div className="instructor-stats">

                    <div className="instructor-stat-card">

                      <span className="instructor-stat-icon">
                        👤
                      </span>

                      <div>

                        <strong>
                          {
                            selectedStudent.enrollmentCount ||
                              0
                          }
                        </strong>

                        <span>
                          Enrollments
                        </span>

                      </div>

                    </div>

                    <div className="instructor-stat-card">

                      <span className="instructor-stat-icon">
                        📚
                      </span>

                      <div>

                        <strong>
                          {
                            selectedStudent.courses
                              ?.length ||
                              0
                          }
                        </strong>

                        <span>
                          Courses
                        </span>

                      </div>

                    </div>

                    <div className="instructor-stat-card">

                      <span className="instructor-stat-icon">
                        ✓
                      </span>

                      <div>

                        <strong>
                          {
                            selectedStudent.disabled
                              ? "Disabled"
                              : "Active"
                          }
                        </strong>

                        <span>
                          Account Status
                        </span>

                      </div>

                    </div>

                  </div>

                  {selectedStudent.courses
                    ?.length > 0 ? (
                    <div className="instructor-course-grid">

                      {selectedStudent.courses.map(
                        (
                          course
                        ) => {

                          const completed =
                            Array.isArray(
                              course.completedLessons
                            )
                              ? course.completedLessons.length
                              : 0

                          return (
                            <article
                              className="instructor-course-card"
                              key={
                                course.courseId
                              }
                            >

                              <div className="instructor-course-top">

                                <span className="instructor-course-category">
                                  {
                                    course.category ||
                                      "Course"
                                  }
                                </span>

                                <span className="instructor-course-price">
                                  ₹
                                  {Number(
                                    course.amount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>

                              </div>

                              <h3>
                                {
                                  course.courseTitle
                                }
                              </h3>

                              <p>
                                Enrollment Status:{" "}
                                {
                                  course.enrollmentStatus ||
                                    "—"
                                }
                              </p>

                              <p>
                                Payment Status:{" "}
                                {
                                  course.paymentStatus ||
                                    "—"
                                }
                              </p>

                              <p>
                                Current Lesson:{" "}
                                {
                                  Number(
                                    course.currentLesson ||
                                      0
                                  )
                                }
                              </p>

                              <p>
                                Completed Lessons:{" "}
                                {
                                  completed
                                }
                              </p>

                              <p>
                                Order ID:{" "}
                                {
                                  course.orderId ||
                                    "—"
                                }
                              </p>

                              <p>
                                Payment ID:{" "}
                                {
                                  course.paymentId ||
                                    "—"
                                }
                              </p>

                              <p>
                                Enrolled:{" "}
                                {course.enrolledAt
                                  ? new Date(
                                      course.enrolledAt
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day:
                                          "2-digit",
                                        month:
                                          "short",
                                        year:
                                          "numeric"
                                      }
                                    )
                                  : "—"}
                              </p>

                              <button
                                type="button"
                                className="instructor-btn instructor-btn-secondary"
                                onClick={() =>
                                  window.location.assign(
                                    `/course-details?course=${encodeURIComponent(
                                      course.courseId
                                    )}`
                                  )
                                }
                              >
                                View Course
                              </button>

                            </article>
                          )
                        }
                      )}

                    </div>
                  ) : (
                    <div className="instructor-empty">

                      <h3>
                        No enrolled courses found
                      </h3>

                    </div>
                  )}

                </>
              )}

            </section>
          )}

          {contentCourse && (
            <section className="instructor-section instructor-content-section">

              <div className="instructor-section-header">

                <div>

                  <span className="instructor-eyebrow">
                    COURSE CONTENT
                  </span>

                  <h2>
                    Manage Content:{" "}
                    {
                      contentCourse.title
                    }
                  </h2>

                </div>

                <button
                  type="button"
                  className="instructor-btn instructor-btn-secondary"
                  onClick={
                    handleCloseContent
                  }
                >
                  Close Content
                </button>

              </div>

              {contentModules.length ===
              0 ? (
                <div className="instructor-empty">

                  <div className="instructor-empty-icon">
                    📖
                  </div>

                  <h3>
                    No modules added yet
                  </h3>

                  <p>
                    Add a module to start
                    building your course.
                  </p>

                </div>
              ) : (
                <div className="instructor-modules">

                  {contentModules.map(
                    (
                      module,
                      moduleIndex
                    ) => (
                      <div
                        className="instructor-module-card"
                        key={
                          moduleIndex
                        }
                      >

                        <div className="instructor-module-header">

                          <div>

                            <span className="instructor-module-number">
                              MODULE{" "}
                              {
                                moduleIndex +
                                1
                              }
                            </span>

                            <h3>
                              Module{" "}
                              {
                                moduleIndex +
                                1
                              }
                            </h3>

                          </div>

                        </div>

                        <div className="instructor-form-group">

                          <label>
                            Module Title
                          </label>

                          <input
                            type="text"
                            value={
                              module.title
                            }
                            onChange={(
                              event
                            ) =>
                              handleModuleTitleChange(
                                moduleIndex,
                                event.target
                                  .value
                              )
                            }
                            placeholder="Example: Introduction"
                          />

                        </div>

                        <div className="instructor-lessons">

                          {module.lessons.length ===
                          0 ? (
                            <p className="instructor-no-lessons">
                              No lessons added yet.
                            </p>
                          ) : (
                            module.lessons.map(
                              (
                                lesson,
                                lessonIndex
                              ) => (
                                <div
                                  className="instructor-lesson-card"
                                  key={
                                    lessonIndex
                                  }
                                >

                                  <div className="instructor-lesson-header">

                                    <h4>
                                      Lesson{" "}
                                      {
                                        lessonIndex +
                                        1
                                      }
                                    </h4>

                                  </div>

                                  <div className="instructor-form-grid">

                                    <div className="instructor-form-group">

                                      <label>
                                        Lesson Title
                                      </label>

                                      <input
                                        type="text"
                                        value={
                                          lesson.title
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          handleLessonChange(
                                            moduleIndex,
                                            lessonIndex,
                                            "title",
                                            event
                                              .target
                                              .value
                                          )
                                        }
                                        placeholder="Example: Introduction to React"
                                      />

                                    </div>

                                    <div className="instructor-form-group">

                                      <label>
                                        YouTube Video ID
                                      </label>

                                      <input
                                        type="text"
                                        value={
                                          lesson.videoId
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          handleLessonChange(
                                            moduleIndex,
                                            lessonIndex,
                                            "videoId",
                                            event
                                              .target
                                              .value
                                          )
                                        }
                                        placeholder="Example: dQw4w9WgXcQ"
                                      />

                                    </div>

                                  </div>

                                  <button
                                    type="button"
                                    className="instructor-btn instructor-btn-danger"
                                    onClick={() =>
                                      handleRemoveLesson(
                                        moduleIndex,
                                        lessonIndex
                                      )
                                    }
                                  >
                                    Remove Lesson
                                  </button>

                                </div>
                              )
                            )
                          )}

                        </div>

                        <div className="instructor-module-actions">

                          <button
                            type="button"
                            className="instructor-btn instructor-btn-content"
                            onClick={() =>
                              handleAddLesson(
                                moduleIndex
                              )
                            }
                          >
                            + Add Lesson
                          </button>

                          <button
                            type="button"
                            className="instructor-btn instructor-btn-danger"
                            onClick={() =>
                              handleRemoveModule(
                                moduleIndex
                              )
                            }
                          >
                            Remove Module
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

              <div className="instructor-content-actions">

                <button
                  type="button"
                  className="instructor-btn instructor-btn-content"
                  onClick={
                    handleAddModule
                  }
                >
                  + Add Module
                </button>

                <button
                  type="button"
                  className="instructor-btn instructor-btn-primary"
                  onClick={
                    handleSaveContent
                  }
                >
                  Save Content
                </button>

                <button
                  type="button"
                  className="instructor-btn instructor-btn-secondary"
                  onClick={
                    handleCloseContent
                  }
                >
                  Close Content
                </button>

              </div>

            </section>
          )}

        </div>

      </div>
    </>
  )
}

export default InstructorDashboard