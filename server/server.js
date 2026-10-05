const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const connectDB = require("./config/db")

dotenv.config()

connectDB()

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173"
  })
)

app.use(express.json())

const authRoutes =
  require("./routes/authRoutes")

app.use(
  "/api/auth",
  authRoutes
)

const dashboardRoutes =
  require("./routes/dashboardRoutes")

app.use(
  "/api/dashboard",
  dashboardRoutes
)

const paymentRoutes =
  require("./routes/paymentRoutes")

app.use(
  "/api/payment",
  paymentRoutes
)

const paymentHistoryRoutes =
  require("./routes/paymentHistoryRoutes")

app.use(
  "/api/payment-history",
  paymentHistoryRoutes
)

const progressRoutes =
  require("./routes/progressRoutes")

app.use(
  "/api/progress",
  progressRoutes
)

const courseRoutes =
  require("./routes/courseRoutes")

app.use(
  "/api/courses",
  courseRoutes
)

const instructorPublicRoutes =
  require("./routes/instructorPublicRoutes")

app.use(
  "/api/instructors",
  instructorPublicRoutes
)

const instructorRoutes =
  require("./routes/instructorRoutes")

app.use(
  "/api/instructor",
  instructorRoutes
)

const instructorStudentRoutes =
  require("./routes/instructorStudentRoutes")

app.use(
  "/api/instructor/students",
  instructorStudentRoutes
)

const instructorProfileRoutes =
  require("./routes/instructorProfileRoutes")

app.use(
  "/api/instructor/profile",
  instructorProfileRoutes
)

const instructorContentRoutes =
  require("./routes/instructorContentRoutes")

app.use(
  "/api/instructor/courses",
  instructorContentRoutes
)

const adminRoutes =
  require("./routes/adminRoutes")

app.use(
  "/api/admin",
  adminRoutes
)

const adminStudentRoutes =
  require("./routes/adminStudentRoutes")

app.use(
  "/api/admin/students",
  adminStudentRoutes
)

const adminCourseRoutes =
  require("./routes/adminCourseRoutes")

app.use(
  "/api/admin/courses",
  adminCourseRoutes
)

const adminEnrollmentRoutes =
  require("./routes/adminEnrollmentRoutes")

app.use(
  "/api/admin/enrollments",
  adminEnrollmentRoutes
)

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      message:
        "LearnSphere backend is running."
    })
  }
)

app.use(
  (req, res) => {
    res.status(404).json({
      message:
        "Route not found."
    })
  }
)

const PORT =
  process.env.PORT || 5000

app.listen(
  PORT,
  () => {
    console.log(
      `LearnSphere server running on port ${PORT}`
    )
  }
)