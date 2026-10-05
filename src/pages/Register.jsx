import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage("")

    const name = formData.name.trim()
    const email = formData.email.trim().toLowerCase()

    if (
      !name ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage(
        "Please fill in all fields."
      )
      return
    }

    if (
      formData.password.length < 6
    ) {
      setMessage(
        "Password must contain at least 6 characters."
      )
      return
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      )
      return
    }

    try {
      setIsLoading(true)

      const response =
        await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              name,
              email,
              password:
                formData.password
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            "Registration failed."
        )
        return
      }

      /*
       * Registration creates the account.
       * Login is responsible for creating
       * the JWT authentication session.
       */
      localStorage.removeItem(
        "learnsphereAuth"
      )

      localStorage.removeItem(
        "learnsphereToken"
      )

      localStorage.removeItem(
        "learnsphereUser"
      )

      window.location.assign(
        "/login"
      )
    } catch (error) {
      console.error(
        "Registration error:",
        error
      )

      setMessage(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="register-page">

        <section className="register-section">

          <div className="register-container">

            <div className="register-card">

              <div className="register-card-header">

                <span>
                  CREATE ACCOUNT
                </span>

                <h1>
                  Start learning with LearnSphere.
                </h1>

                <p>
                  Create your account and begin
                  building the skills you need
                  for your career.
                </p>

              </div>

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <div className="register-field">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="name"
                  />

                </div>

                <div className="register-field">

                  <label htmlFor="register-email">
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    placeholder="Enter your email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="email"
                  />

                </div>

                <div className="register-field">

                  <label htmlFor="register-password">
                    Password
                  </label>

                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    placeholder="Create a password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="new-password"
                  />

                </div>

                <div className="register-field">

                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="new-password"
                  />

                </div>

                <label className="register-terms">

                  <input
                    type="checkbox"
                    required
                  />

                  <span>
                    I agree to the LearnSphere
                    terms and conditions.
                  </span>

                </label>

                <button
                  type="submit"
                  className="register-submit"
                  disabled={
                    isLoading
                  }
                >
                  {isLoading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                {message && (
                  <p className="register-message">
                    {message}
                  </p>
                )}

              </form>

              <div className="register-login">

                <p>
                  Already have an account?
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.assign(
                      "/login"
                    )
                  }
                >
                  Sign in
                </button>

              </div>

            </div>

            <div className="register-content">

              <div className="register-content-label">
                LEARNSPHERE PLATFORM
              </div>

              <h2>
                Turn your
                <strong>
                  {" "}
                  curiosity into skills.
                </strong>
              </h2>

              <p>
                Learn from structured courses,
                practice your skills, complete
                assessments, and build certificates
                that showcase your progress.
              </p>

              <div className="register-stats">

                <div className="register-stat">

                  <strong>
                    50K+
                  </strong>

                  <span>
                    Learners
                  </span>

                </div>

                <div className="register-stat">

                  <strong>
                    120+
                  </strong>

                  <span>
                    Courses
                  </span>

                </div>

                <div className="register-stat">

                  <strong>
                    40+
                  </strong>

                  <span>
                    Instructors
                  </span>

                </div>

              </div>

              <div className="register-feature-list">

                <div>

                  <span>
                    01
                  </span>

                  <p>
                    Learn industry-relevant
                    technologies
                  </p>

                </div>

                <div>

                  <span>
                    02
                  </span>

                  <p>
                    Track your learning progress
                  </p>

                </div>

                <div>

                  <span>
                    03
                  </span>

                  <p>
                    Earn certificates after
                    completion
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Register