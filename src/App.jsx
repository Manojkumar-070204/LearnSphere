import Home from "./pages/Home"
import Courses from "./pages/Courses"
import CourseDetails from "./pages/CourseDetails"
import Learning from "./pages/Learning"
import Quiz from "./pages/Quiz"
import Certificates from "./pages/Certificates"
import Instructors from "./pages/Instructors"
import InstructorDetails from "./pages/InstructorDetails"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import PaymentHistory from "./pages/PaymentHistory"
import ResetPassword from "./pages/ResetPassword"
import InstructorDashboard from "./pages/InstructorDashboard"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  const currentPath = window.location.pathname

  const isAuthenticated =
    localStorage.getItem("learnsphereAuth") === "true"

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/courses",
    "/course-details",
    "/instructors",
    "/instructor-details",
    "/about",
    "/contact"
  ]

  if (!isAuthenticated && !publicPaths.includes(currentPath)) {
    window.location.assign("/login")
    return null
  }

  if (currentPath === "/login") {
    return <Login />
  }

  if (currentPath === "/register") {
    return <Register />
  }

  if (currentPath === "/courses") {
    return <Courses />
  }

  if (currentPath === "/course-details") {
    return <CourseDetails />
  }

  if (currentPath === "/learning") {
    return <Learning />
  }

  if (currentPath === "/quiz") {
    return <Quiz />
  }

  if (currentPath === "/certificates") {
    return <Certificates />
  }

  if (currentPath === "/instructors") {
    return <Instructors />
  }

  if (currentPath === "/instructor-details") {
    return <InstructorDetails />
  }

  if (currentPath === "/about") {
    return <About />
  }

  if (currentPath === "/contact") {
    return <Contact />
  }

  if (currentPath === "/dashboard") {
    return <Dashboard />
  }

  if (currentPath === "/payment-history") {
    return <PaymentHistory />
  }

  if (currentPath === "/reset-password") {
    return <ResetPassword />
  }

  if (currentPath === "/instructor-dashboard") {
    return <InstructorDashboard />
  }

  if (currentPath === "/admin") {
    return <AdminDashboard />
  }

  return <Home />
}

export default App
