import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please choose a valid image file."))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        const maxSize = 1200
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        )

        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext("2d")
        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        )

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

function AdminDashboard() {
  const [data, setData] =
    useState(null)

  const [students, setStudents] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [instructorForm, setInstructorForm] =
    useState({
      name: "",
      email: "",
      password: "",
      photo: "",
      bio: "",
      expertise: "",
      experience: ""
    })

  const [editingInstructor, setEditingInstructor] =
    useState(null)

  const [studentForm, setStudentForm] =
    useState({
      name: "",
      email: "",
      photo: ""
    })

  const [editingStudent, setEditingStudent] =
    useState(null)

  const [courseForm, setCourseForm] =
    useState({
      title: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      image: ""
    })

  const [editingCourse, setEditingCourse] =
    useState(null)

  const [activeSection, setActiveSection] =
    useState("overview")

  const token =
    localStorage.getItem(
      "learnsphereToken"
    )

  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  const loadDashboard = async () => {
    try {
      const response =
        await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load admin dashboard."
        )
      }

      setData(result)
    } catch (dashboardError) {
      setError(
        dashboardError.message
      )
    }
  }

  const loadStudents = async () => {
    try {
      const response =
        await fetch(
          "http://localhost:5000/api/admin/students",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load students."
        )
      }

      setStudents(
        Array.isArray(
          result.students
        )
          ? result.students
          : []
      )
    } catch (studentError) {
      setError(
        studentError.message
      )
    }
  }

  const refreshDashboard = async () => {
    await Promise.all([
      loadDashboard(),
      loadStudents()
    ])
  }

  useEffect(() => {
    let cancelled = false

    async function loadAdminData() {
      try {
        const [
          dashboardResponse,
          studentsResponse
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/admin/dashboard",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          ),

          fetch(
            "http://localhost:5000/api/admin/students",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )
        ])

        const dashboardResult =
          await dashboardResponse.json()

        const studentsResult =
          await studentsResponse.json()

        if (
          !dashboardResponse.ok
        ) {
          throw new Error(
            dashboardResult.message ||
              "Unable to load admin dashboard."
          )
        }

        if (
          !studentsResponse.ok
        ) {
          throw new Error(
            studentsResult.message ||
              "Unable to load students."
          )
        }

        if (!cancelled) {
          setData(
            dashboardResult
          )

          setStudents(
            Array.isArray(
              studentsResult.students
            )
              ? studentsResult.students
              : []
          )

          setError("")
          setLoading(false)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message
          )
          setLoading(false)
        }
      }
    }

    loadAdminData()

    return () => {
      cancelled = true
    }
  }, [token])

  const handleInstructorChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target

    setInstructorForm({
      ...instructorForm,
      [name]: value
    })
  }

  const handleInstructorImageChange = async (
    event
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      setError("")
      const photo = await readImageFile(file)

      setInstructorForm((currentForm) => ({
        ...currentForm,
        photo
      }))
    } catch (imageError) {
      setError(imageError.message)
    }
  }

  const resetInstructorForm = () => {
    setInstructorForm({
      name: "",
      email: "",
      password: "",
      photo: "",
      bio: "",
      expertise: "",
      experience: ""
    })

    setEditingInstructor(null)
  }

  const handleInstructorSubmit = async (
    event
  ) => {
    event.preventDefault()

    clearMessages()

    try {
      const endpoint =
        editingInstructor
          ? `http://localhost:5000/api/admin/instructors/${editingInstructor.id}`
          : "http://localhost:5000/api/admin/instructors"

      const method =
        editingInstructor
          ? "PUT"
          : "POST"

      const body = {
        name:
          instructorForm.name.trim(),

        email:
          instructorForm.email.trim(),

        photo:
          instructorForm.photo.trim(),

        bio:
          instructorForm.bio,

        expertise:
          instructorForm.expertise,

        experience:
          instructorForm.experience
      }

      if (
        instructorForm.password
      ) {
        body.password =
          instructorForm.password
      }

      const response =
        await fetch(
          endpoint,
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body:
              JSON.stringify(body)
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save instructor."
        )
      }

      setSuccess(
        result.message ||
          (
            editingInstructor
              ? "Instructor updated successfully."
              : "Instructor created successfully."
          )
      )

      resetInstructorForm()

      await refreshDashboard()
    } catch (instructorError) {
      setError(
        instructorError.message
      )
    }
  }

  const handleEditInstructor = (
    instructor
  ) => {
    clearMessages()

    setActiveSection(
      "instructors"
    )

    setEditingInstructor(
      instructor
    )

    setInstructorForm({
      name:
        instructor.name || "",
      email:
        instructor.email || "",
      password: "",
      photo:
        instructor.photo || "",
      bio:
        instructor.bio || "",
      expertise:
        Array.isArray(
          instructor.expertise
        )
          ? instructor.expertise.join(
              ", "
            )
          : instructor.expertise ||
            "",
      experience:
        instructor.experience ||
        ""
    })
  }

  const handleInstructorStatus =
    async (
      instructorId
    ) => {
      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/instructors/${instructorId}/status`,
            {
              method: "PUT",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update instructor status."
          )
        }

        setSuccess(
          result.message ||
            "Instructor status updated successfully."
        )

        await refreshDashboard()
      } catch (statusError) {
        setError(
          statusError.message
        )
      }
    }

  const handleDeleteInstructor =
    async (
      instructorId
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this instructor and all of their courses?"
        )

      if (!confirmed) {
        return
      }

      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/instructors/${instructorId}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to delete instructor."
          )
        }

        setSuccess(
          result.message ||
            "Instructor deleted successfully."
        )

        if (
          editingInstructor?.id ===
          instructorId
        ) {
          resetInstructorForm()
        }

        await refreshDashboard()
      } catch (deleteError) {
        setError(
          deleteError.message
        )
      }
    }

  const handleStudentChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target

    setStudentForm({
      ...studentForm,
      [name]: value
    })
  }

  const resetStudentForm = () => {
    setStudentForm({
      name: "",
      email: "",
      photo: ""
    })

    setEditingStudent(null)
  }

  const handleEditStudent = (
    student
  ) => {
    clearMessages()

    setActiveSection(
      "students"
    )

    setEditingStudent(
      student
    )

    setStudentForm({
      name:
        student.name || "",
      email:
        student.email || "",
      photo:
        student.photo || ""
    })
  }

  const handleStudentSubmit = async (
    event
  ) => {
    event.preventDefault()

    if (!editingStudent) {
      return
    }

    clearMessages()

    try {
      const response =
        await fetch(
          `http://localhost:5000/api/admin/students/${editingStudent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body:
              JSON.stringify({
                name:
                  studentForm.name.trim(),
                email:
                  studentForm.email.trim(),
                photo:
                  studentForm.photo.trim()
              })
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update student."
        )
      }

      setSuccess(
        result.message ||
          "Student updated successfully."
      )

      resetStudentForm()

      await refreshDashboard()
    } catch (studentError) {
      setError(
        studentError.message
      )
    }
  }

  const handleStudentStatus =
    async (
      studentId
    ) => {
      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/students/${studentId}/status`,
            {
              method: "PUT",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update student status."
          )
        }

        setSuccess(
          result.message ||
            "Student status updated successfully."
        )

        await refreshDashboard()
      } catch (statusError) {
        setError(
          statusError.message
        )
      }
    }

  const handleDeleteStudent =
    async (
      studentId
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this student and their enrollment data?"
        )

      if (!confirmed) {
        return
      }

      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/students/${studentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to delete student."
          )
        }

        setSuccess(
          result.message ||
            "Student deleted successfully."
        )

        if (
          editingStudent?.id ===
          studentId
        ) {
          resetStudentForm()
        }

        await refreshDashboard()
      } catch (deleteError) {
        setError(
          deleteError.message
        )
      }
    }

  const handleCourseChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target

    setCourseForm({
      ...courseForm,
      [name]: value
    })
  }

  const handleCourseImageChange = async (
    event
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      setError("")
      const image = await readImageFile(file)

      setCourseForm((currentForm) => ({
        ...currentForm,
        image
      }))
    } catch (imageError) {
      setError(imageError.message)
    }
  }

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      image: ""
    })

    setEditingCourse(null)
  }

  const handleEditCourse = (
    course
  ) => {
    clearMessages()

    setActiveSection(
      "courses"
    )

    setEditingCourse(
      course
    )

    setCourseForm({
      title:
        course.title || "",
      description:
        course.description || "",
      category:
        course.category || "",
      price:
        course.price ?? "",
      duration:
        course.duration || "",
      image:
        course.image || ""
    })
  }

  const handleCourseSubmit =
    async (
      event
    ) => {
      event.preventDefault()

      if (!editingCourse) {
        return
      }

      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/courses/${editingCourse.courseId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`
              },
              body:
                JSON.stringify({
                  title:
                    courseForm.title.trim(),

                  description:
                    courseForm.description,

                  category:
                    courseForm.category.trim(),

                  price:
                    Number(
                      courseForm.price
                    ),

                  duration:
                    courseForm.duration,

                  image:
                    courseForm.image.trim()
                })
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update course."
          )
        }

        setSuccess(
          result.message ||
            "Course updated successfully."
        )

        resetCourseForm()

        await refreshDashboard()
      } catch (courseError) {
        setError(
          courseError.message
        )
      }
    }

  const handleDeleteCourse =
    async (
      courseId
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this course and its enrollment data?"
        )

      if (!confirmed) {
        return
      }

      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/courses/${courseId}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to delete course."
          )
        }

        setSuccess(
          result.message ||
            "Course deleted successfully."
        )

        if (
          editingCourse?.courseId ===
          courseId
        ) {
          resetCourseForm()
        }

        await refreshDashboard()
      } catch (deleteError) {
        setError(
          deleteError.message
        )
      }
    }

  const handleEnrollmentStatus =
    async (
      enrollmentId,
      status
    ) => {
      clearMessages()

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/admin/enrollments/${enrollmentId}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`
              },
              body:
                JSON.stringify({
                  status
                })
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update enrollment."
          )
        }

        setSuccess(
          result.message ||
            "Enrollment updated successfully."
        )

        await refreshDashboard()
      } catch (enrollmentError) {
        setError(
          enrollmentError.message
        )
      }
    }

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "—"
    }

    const value =
      new Date(date)

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "—"
    }

    return value.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    )
  }

  const formatAmount = (
    amount
  ) => {
    return Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="dashboard-page">

          <div className="dashboard-container">

            <div
              className="dashboard-header"
              style={{
                minHeight:
                  "300px",
                display:
                  "flex",
                alignItems:
                  "center"
              }}
            >
              <div>
                <h1>
                  Loading Admin Dashboard...
                </h1>

                <p>
                  Loading LearnSphere management data.
                </p>
              </div>
            </div>

          </div>

        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="dashboard-page">

        <div className="dashboard-container">

          <div className="dashboard-header">

            <div>

              <span
                style={{
                  display:
                    "block",
                  marginBottom:
                    "8px",
                  fontSize:
                    "11px",
                  fontWeight:
                    "800",
                  letterSpacing:
                    "0.14em"
                }}
              >
                LEARNSPHERE ADMIN
              </span>

              <h1>
                Admin Dashboard
              </h1>

              <p>
                Manage users, instructors,
                courses, enrollments and payments.
              </p>

            </div>

          </div>

          {error && (
            <div
              style={{
                marginBottom:
                  "20px",
                padding:
                  "14px 18px",
                border:
                  "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius:
                  "10px",
                background:
                  "rgba(239, 68, 68, 0.08)",
                color:
                  "#fca5a5",
                fontSize:
                  "13px"
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginBottom:
                  "20px",
                padding:
                  "14px 18px",
                border:
                  "1px solid rgba(34, 197, 94, 0.35)",
                borderRadius:
                  "10px",
                background:
                  "rgba(34, 197, 94, 0.08)",
                color:
                  "#86efac",
                fontSize:
                  "13px"
              }}
            >
              {success}
            </div>
          )}

          <div
            style={{
              display:
                "flex",
              flexWrap:
                "wrap",
              gap:
                "8px",
              marginBottom:
                "28px"
            }}
          >

            {[
              ["overview", "Overview"],
              ["instructors", "Instructors"],
              ["students", "Students"],
              ["courses", "Courses"],
              ["enrollments", "Enrollments"]
            ].map(
              ([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    clearMessages()
                    setActiveSection(
                      value
                    )
                  }}
                  style={{
                    padding:
                      "10px 16px",
                    border:
                      "1px solid #263b54",
                    borderRadius:
                      "8px",
                    background:
                      activeSection ===
                      value
                        ? "#635bff"
                        : "#0a1828",
                    color:
                      "#ffffff",
                    cursor:
                      "pointer",
                    fontFamily:
                      "inherit",
                    fontSize:
                      "12px",
                    fontWeight:
                      "700"
                  }}
                >
                  {label}
                </button>
              )
            )}

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon">
                👥
              </div>

              <div>

                <h3>
                  {data?.stats?.totalUsers ||
                    0}
                </h3>

                <p>
                  Total Users
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🎓
              </div>

              <div>

                <h3>
                  {data?.stats?.totalStudents ||
                    0}
                </h3>

                <p>
                  Students
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                👨‍🏫
              </div>

              <div>

                <h3>
                  {data?.stats?.totalInstructors ||
                    0}
                </h3>

                <p>
                  Instructors
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                📚
              </div>

              <div>

                <h3>
                  {data?.stats?.totalCourses ||
                    0}
                </h3>

                <p>
                  Courses
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🧾
              </div>

              <div>

                <h3>
                  {data?.stats?.totalEnrollments ||
                    0}
                </h3>

                <p>
                  Enrollments
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ⏳
              </div>

              <div>

                <h3>
                  {data?.stats?.pendingEnrollments ||
                    0}
                </h3>

                <p>
                  Pending Approval
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                ₹
              </div>

              <div>

                <h3>
                  ₹
                  {formatAmount(
                    data?.stats?.totalRevenue
                  )}
                </h3>

                <p>
                  Revenue
                </p>

              </div>

            </div>

          </div>

          {activeSection ===
            "overview" && (
            <>

              <section className="dashboard-section">

                <div className="section-header">

                  <h2>
                    Pending Enrollments
                  </h2>

                  <span>
                    {data?.stats?.pendingEnrollments ||
                      0}
                    {" pending"}
                  </span>

                </div>

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>

                        <th>
                          Student
                        </th>

                        <th>
                          Course
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Order ID
                        </th>

                        <th>
                          Payment ID
                        </th>

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {(
                        data?.enrollments ||
                        []
                      ).filter(
                        (item) =>
                          item.status ===
                            "pending" ||
                          item.enrollmentStatus ===
                            "pending"
                      ).length >
                      0 ? (
                        (
                          data?.enrollments ||
                          []
                        )
                          .filter(
                            (item) =>
                              item.status ===
                                "pending" ||
                              item.enrollmentStatus ===
                                "pending"
                          )
                          .map(
                            (
                              enrollment
                            ) => (

                              <tr
                                key={
                                  enrollment.id ||
                                  enrollment._id
                                }
                              >

                                <td>
                                  {enrollment.student?.name ||
                                    enrollment.user?.name ||
                                    "—"}
                                </td>

                                <td>
                                  {enrollment.courseTitle ||
                                    enrollment.courseId ||
                                    "—"}
                                </td>

                                <td>
                                  ₹
                                  {formatAmount(
                                    enrollment.amount
                                  )}
                                </td>

                                <td>
                                  {enrollment.orderId ||
                                    enrollment.payment?.razorpayOrderId ||
                                    "—"}
                                </td>

                                <td>
                                  {enrollment.paymentId ||
                                    enrollment.payment?.razorpayPaymentId ||
                                    "—"}
                                </td>

                                <td>

                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      gap:
                                        "6px",
                                      flexWrap:
                                        "wrap"
                                    }}
                                  >

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEnrollmentStatus(
                                          enrollment.id ||
                                            enrollment._id,
                                          "approved"
                                        )
                                      }
                                      style={{
                                        padding:
                                          "7px 10px",
                                        border:
                                          "none",
                                        borderRadius:
                                          "6px",
                                        background:
                                          "#16a34a",
                                        color:
                                          "#ffffff",
                                        cursor:
                                          "pointer",
                                        fontSize:
                                          "11px",
                                        fontWeight:
                                          "700"
                                      }}
                                    >
                                      Approve
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEnrollmentStatus(
                                          enrollment.id ||
                                            enrollment._id,
                                          "rejected"
                                        )
                                      }
                                      style={{
                                        padding:
                                          "7px 10px",
                                        border:
                                          "none",
                                        borderRadius:
                                          "6px",
                                        background:
                                          "#dc2626",
                                        color:
                                          "#ffffff",
                                        cursor:
                                          "pointer",
                                        fontSize:
                                          "11px",
                                        fontWeight:
                                          "700"
                                      }}
                                    >
                                      Reject
                                    </button>

                                  </div>

                                </td>

                              </tr>

                            )
                          )
                      ) : (
                        <tr>

                          <td
                            colSpan="6"
                          >
                            No pending enrollments.
                          </td>

                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

              <section className="dashboard-section">

                <div className="section-header">

                  <h2>
                    Recent Enrollments
                  </h2>

                </div>

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>

                        <th>
                          Student
                        </th>

                        <th>
                          Course
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Payment
                        </th>

                        <th>
                          Date
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {(
                        data?.enrollments ||
                        []
                      )
                        .slice(0, 8)
                        .map(
                          (
                            enrollment
                          ) => (

                            <tr
                              key={
                                enrollment.id ||
                                enrollment._id
                              }
                            >

                              <td>
                                {enrollment.student?.name ||
                                  enrollment.user?.name ||
                                  "—"}
                              </td>

                              <td>
                                {enrollment.courseTitle ||
                                  enrollment.courseId ||
                                  "—"}
                              </td>

                              <td>

                                <span className="status-badge">
                                  {enrollment.enrollmentStatus ||
                                    enrollment.status ||
                                    "—"}
                                </span>

                              </td>

                              <td>
                                {enrollment.paymentStatus ||
                                  enrollment.payment?.status ||
                                  "—"}
                              </td>

                              <td>
                                {formatDate(
                                  enrollment.enrolledAt ||
                                    enrollment.createdAt
                                )}
                              </td>

                            </tr>

                          )
                        )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>
          )}

          {activeSection ===
            "instructors" && (
            <>

              <section className="dashboard-section">

                <div className="section-header">

                  <h2>
                    {editingInstructor
                      ? "Edit Instructor"
                      : "Create Instructor"}
                  </h2>

                </div>

                <form
                  onSubmit={
                    handleInstructorSubmit
                  }
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap:
                      "14px"
                  }}
                >

                  <input
                    name="name"
                    value={
                      instructorForm.name
                    }
                    onChange={
                      handleInstructorChange
                    }
                    placeholder="Full Name"
                    required
                    style={{
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit"
                    }}
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      instructorForm.email
                    }
                    onChange={
                      handleInstructorChange
                    }
                    placeholder="Email Address"
                    required
                    style={{
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit"
                    }}
                  />

                  <input
                    type="password"
                    name="password"
                    value={
                      instructorForm.password
                    }
                    onChange={
                      handleInstructorChange
                    }
                    placeholder={
                      editingInstructor
                        ? "New Password (optional)"
                        : "Password"
                    }
                    required={
                      !editingInstructor
                    }
                    style={{
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit"
                    }}
                  />

                  <input
                    name="experience"
                    value={
                      instructorForm.experience
                    }
                    onChange={
                      handleInstructorChange
                    }
                    placeholder="Experience (e.g. 8+ Years)"
                    style={{
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit"
                    }}
                  />

                  <input
                    name="expertise"
                    value={
                      instructorForm.expertise
                    }
                    onChange={
                      handleInstructorChange
                    }
                    placeholder="Expertise"
                    style={{
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit"
                    }}
                  />

                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={
                      handleInstructorImageChange
                    }
                    style={{
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit"
                    }}
                  />

                  <textarea
                    name="bio"
                    value={
                      instructorForm.bio
                    }
                    onChange={
                      handleInstructorChange
                    }
                    placeholder="Instructor Bio"
                    rows="4"
                    style={{
                      gridColumn:
                        "1 / -1",
                      padding:
                        "12px",
                      border:
                        "1px solid #263b54",
                      borderRadius:
                        "8px",
                      background:
                        "#081522",
                      color:
                        "#ffffff",
                      fontFamily:
                        "inherit",
                      resize:
                        "vertical"
                    }}
                  />

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                      display:
                        "flex",
                      gap:
                        "8px"
                    }}
                  >

                    <button
                      type="submit"
                      className="dashboard-primary-button"
                    >
                      {editingInstructor
                        ? "Update Instructor"
                        : "Create Instructor"}
                    </button>

                    {editingInstructor && (
                      <button
                        type="button"
                        className="dashboard-secondary-button"
                        onClick={
                          resetInstructorForm
                        }
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </section>

              <section className="dashboard-section">

                <div className="section-header">

                  <h2>
                    Instructors
                  </h2>

                </div>

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>

                        <th>
                          Name
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Courses
                        </th>

                        <th>
                          Students
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {(
                        data?.instructors ||
                        []
                      ).length > 0 ? (
                        data.instructors.map(
                          (
                            instructor
                          ) => (

                            <tr
                              key={
                                instructor.id ||
                                instructor._id
                              }
                            >

                              <td>
                                {instructor.name ||
                                  "—"}
                              </td>

                              <td>
                                {instructor.email ||
                                  "—"}
                              </td>

                              <td>
                                {instructor.courseCount ||
                                  0}
                              </td>

                              <td>
                                {instructor.studentCount ||
                                  0}
                              </td>

                              <td>

                                <span className="status-badge">
                                  {instructor.disabled
                                    ? "Disabled"
                                    : "Active"}
                                </span>

                              </td>

                              <td>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    gap:
                                      "6px"
                                  }}
                                >

                                  <button
                                    type="button"
                                    className="dashboard-secondary-button"
                                    onClick={() =>
                                      handleEditInstructor(
                                        instructor
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="dashboard-secondary-button"
                                    onClick={() =>
                                      handleInstructorStatus(
                                        instructor.id ||
                                          instructor._id
                                      )
                                    }
                                  >
                                    {instructor.disabled
                                      ? "Enable"
                                      : "Disable"}
                                  </button>

                                  <button
                                    type="button"
                                    className="dashboard-danger-button"
                                    onClick={() =>
                                      handleDeleteInstructor(
                                        instructor.id ||
                                          instructor._id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )
                      ) : (
                        <tr>

                          <td
                            colSpan="6"
                          >
                            No instructors found.
                          </td>

                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>
          )}

          {activeSection ===
            "students" && (
            <>

              {editingStudent && (
                <section className="dashboard-section">

                  <div className="section-header">

                    <h2>
                      Edit Student
                    </h2>

                  </div>

                  <form
                    onSubmit={
                      handleStudentSubmit
                    }
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap:
                        "14px"
                    }}
                  >

                    <input
                      name="name"
                      value={
                        studentForm.name
                      }
                      onChange={
                        handleStudentChange
                      }
                      placeholder="Full Name"
                      required
                      style={{
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <input
                      type="email"
                      name="email"
                      value={
                        studentForm.email
                      }
                      onChange={
                        handleStudentChange
                      }
                      placeholder="Email Address"
                      required
                      style={{
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <input
                      name="photo"
                      value={
                        studentForm.photo
                      }
                      onChange={
                        handleStudentChange
                      }
                      placeholder="Photo URL"
                      style={{
                        gridColumn:
                          "1 / -1",
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <div
                      style={{
                        gridColumn:
                          "1 / -1",
                        display:
                          "flex",
                        gap:
                          "8px"
                      }}
                    >

                      <button
                        type="submit"
                        className="dashboard-primary-button"
                      >
                        Update Student
                      </button>

                      <button
                        type="button"
                        className="dashboard-secondary-button"
                        onClick={
                          resetStudentForm
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </form>

                </section>
              )}

              <section className="dashboard-section">

                <div className="section-header">

                  <h2>
                    Students
                  </h2>

                </div>

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>

                        <th>
                          Name
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Courses
                        </th>

                        <th>
                          Pending
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {students.length >
                      0 ? (
                        students.map(
                          (
                            student
                          ) => (

                            <tr
                              key={
                                student.id ||
                                student._id
                              }
                            >

                              <td>
                                {student.name ||
                                  "—"}
                              </td>

                              <td>
                                {student.email ||
                                  "—"}
                              </td>

                              <td>
                                {student.approvedCourseCount ||
                                  0}
                              </td>

                              <td>
                                {student.pendingCourseCount ||
                                  0}
                              </td>

                              <td>

                                <span className="status-badge">
                                  {student.disabled
                                    ? "Disabled"
                                    : "Active"}
                                </span>

                              </td>

                              <td>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    gap:
                                      "6px"
                                  }}
                                >

                                  <button
                                    type="button"
                                    className="dashboard-secondary-button"
                                    onClick={() =>
                                      handleEditStudent(
                                        student
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="dashboard-secondary-button"
                                    onClick={() =>
                                      handleStudentStatus(
                                        student.id ||
                                          student._id
                                      )
                                    }
                                  >
                                    {student.disabled
                                      ? "Enable"
                                      : "Disable"}
                                  </button>

                                  <button
                                    type="button"
                                    className="dashboard-danger-button"
                                    onClick={() =>
                                      handleDeleteStudent(
                                        student.id ||
                                          student._id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )
                      ) : (
                        <tr>

                          <td
                            colSpan="6"
                          >
                            No students found.
                          </td>

                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>
          )}

          {activeSection ===
            "courses" && (
            <>

              {editingCourse && (
                <section className="dashboard-section">

                  <div className="section-header">

                    <h2>
                      Edit Course
                    </h2>

                  </div>

                  <form
                    onSubmit={
                      handleCourseSubmit
                    }
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap:
                        "14px"
                    }}
                  >

                    <input
                      name="title"
                      value={
                        courseForm.title
                      }
                      onChange={
                        handleCourseChange
                      }
                      placeholder="Course Title"
                      required
                      style={{
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <input
                      name="category"
                      value={
                        courseForm.category
                      }
                      onChange={
                        handleCourseChange
                      }
                      placeholder="Category"
                      style={{
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <input
                      type="number"
                      name="price"
                      value={
                        courseForm.price
                      }
                      onChange={
                        handleCourseChange
                      }
                      min="0"
                      placeholder="Price"
                      required
                      style={{
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <input
                      name="duration"
                      value={
                        courseForm.duration
                      }
                      onChange={
                        handleCourseChange
                      }
                      placeholder="Duration"
                      style={{
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={
                        handleCourseImageChange
                      }
                      style={{
                        gridColumn:
                          "1 / -1",
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit"
                      }}
                    />

                    <textarea
                      name="description"
                      value={
                        courseForm.description
                      }
                      onChange={
                        handleCourseChange
                      }
                      placeholder="Course Description"
                      rows="4"
                      style={{
                        gridColumn:
                          "1 / -1",
                        padding:
                          "12px",
                        border:
                          "1px solid #263b54",
                        borderRadius:
                          "8px",
                        background:
                          "#081522",
                        color:
                          "#ffffff",
                        fontFamily:
                          "inherit",
                        resize:
                          "vertical"
                      }}
                    />

                    <div
                      style={{
                        gridColumn:
                          "1 / -1",
                        display:
                          "flex",
                        gap:
                          "8px"
                      }}
                    >

                      <button
                        type="submit"
                        className="dashboard-primary-button"
                      >
                        Update Course
                      </button>

                      <button
                        type="button"
                        className="dashboard-secondary-button"
                        onClick={
                          resetCourseForm
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </form>

                </section>
              )}

              <section className="dashboard-section">

                <div className="section-header">

                  <h2>
                    Courses
                  </h2>

                </div>

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>

                        <th>
                          Course
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Instructor
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Enrollments
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {(
                        data?.courses ||
                        []
                      ).length > 0 ? (
                        data.courses.map(
                          (
                            course
                          ) => (

                            <tr
                              key={
                                course._id
                              }
                            >

                              <td>

                                <div>

                                  <strong>
                                    {course.title ||
                                      "—"}
                                  </strong>

                                  <small
                                    style={{
                                      display:
                                        "block",
                                      marginTop:
                                        "4px",
                                      opacity:
                                        "0.65"
                                    }}
                                  >
                                    {course.courseId}
                                  </small>

                                </div>

                              </td>

                              <td>
                                {course.category ||
                                  "—"}
                              </td>

                              <td>
                                {course.instructor?.name ||
                                  course.instructor?.email ||
                                  "—"}
                              </td>

                              <td>
                                ₹
                                {formatAmount(
                                  course.price
                                )}
                              </td>

                              <td>
                                {course.enrollmentCount ||
                                  0}
                              </td>

                              <td>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    flexWrap:
                                      "wrap",
                                    gap:
                                      "6px"
                                  }}
                                >

                                  <button
                                    type="button"
                                    className="dashboard-secondary-button"
                                    onClick={() =>
                                      handleEditCourse(
                                        course
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="dashboard-danger-button"
                                    onClick={() =>
                                      handleDeleteCourse(
                                        course.courseId
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )
                      ) : (
                        <tr>

                          <td
                            colSpan="6"
                          >
                            No courses found.
                          </td>

                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>
          )}

          {activeSection ===
            "enrollments" && (
            <section className="dashboard-section">

              <div className="section-header">

                <h2>
                  All Enrollments
                </h2>

              </div>

              <div className="dashboard-table-wrapper">

                <table className="dashboard-table">

                  <thead>

                    <tr>

                      <th>
                        Student
                      </th>

                      <th>
                        Course
                      </th>

                      <th>
                        Instructor
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Order ID
                      </th>

                      <th>
                        Payment ID
                      </th>

                      <th>
                        Enrollment
                      </th>

                      <th>
                        Payment
                      </th>

                      <th>
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {(
                      data?.enrollments ||
                      []
                    ).length > 0 ? (
                      data.enrollments.map(
                        (
                          enrollment
                        ) => (

                          <tr
                            key={
                              enrollment.id ||
                              enrollment._id
                            }
                          >

                            <td>
                              {enrollment.student?.name ||
                                enrollment.user?.name ||
                                "—"}
                            </td>

                            <td>
                              {enrollment.courseTitle ||
                                enrollment.courseId ||
                                "—"}
                            </td>

                            <td>
                              {enrollment.instructor?.name ||
                                enrollment.instructor?.email ||
                                "—"}
                            </td>

                            <td>
                              ₹
                              {formatAmount(
                                enrollment.amount
                              )}
                            </td>

                            <td>
                              {enrollment.orderId ||
                                enrollment.payment?.razorpayOrderId ||
                                "—"}
                            </td>

                            <td>
                              {enrollment.paymentId ||
                                enrollment.payment?.razorpayPaymentId ||
                                "—"}
                            </td>

                            <td>

                              <span className="status-badge">
                                {enrollment.enrollmentStatus ||
                                  enrollment.status ||
                                  "—"}
                              </span>

                            </td>

                            <td>
                              {enrollment.paymentStatus ||
                                enrollment.payment?.status ||
                                "—"}
                            </td>

                            <td>
                              {formatDate(
                                enrollment.enrolledAt ||
                                  enrollment.createdAt
                              )}
                            </td>

                          </tr>

                        )
                      )
                    ) : (
                      <tr>

                        <td
                          colSpan="9"
                        >
                          No enrollments found.
                        </td>

                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </section>
          )}

        </div>

      </main>

      <Footer />
    </>
  )
}

export default AdminDashboard