import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [resetEmail, setResetEmail] =
    useState("")

  const [message, setMessage] =
    useState("")

  const [isLoading, setIsLoading] =
    useState(false)

  const [isForgotPassword, setIsForgotPassword] =
    useState(false)

  const [resetSent, setResetSent] =
    useState(false)

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

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage("")

    const email =
      formData.email.trim()

    if (
      !email ||
      !formData.password
    ) {
      setMessage(
        "Please enter your email and password."
      )
      return
    }

    try {
      setIsLoading(true)

      const response =
        await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
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
            "Login failed."
        )
        return
      }

      if (!data.token) {
        setMessage(
          "Login succeeded, but authentication token was not received."
        )
        return
      }

      const user = {
        id: data.user?.id,
        name: data.user?.name,
        email: data.user?.email,
        role:
          data.user?.role ||
          "student"
      }

      localStorage.setItem(
        "learnsphereToken",
        data.token
      )

      localStorage.setItem(
        "learnsphereAuth",
        "true"
      )

      localStorage.setItem(
        "learnsphereUser",
        JSON.stringify(user)
      )

      if (
        user.role ===
        "admin"
      ) {
        window.location.assign(
          "/admin"
        )

        return
      }

      if (
        user.role ===
        "instructor"
      ) {
        window.location.assign(
          "/instructor-dashboard"
        )

        return
      }

      window.location.assign(
        "/dashboard"
      )
    } catch (error) {
      console.error(
        "Login error:",
        error
      )

      setMessage(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleForgotPassword(
    event
  ) {
    event.preventDefault()

    setMessage("")

    const email =
      resetEmail.trim()

    if (!email) {
      setMessage(
        "Please enter your email address."
      )
      return
    }

    try {
      setIsLoading(true)

      const response =
        await fetch(
          "http://localhost:5000/api/auth/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              email
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to send reset link."
        )
        return
      }

      setResetSent(true)

      setMessage(
        data.message ||
          "Password reset email sent successfully."
      )
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      )

      setMessage(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  function showForgotPassword() {
    setIsForgotPassword(true)
    setResetSent(false)
    setMessage("")
    setResetEmail("")
  }

  function showLogin() {
    setIsForgotPassword(false)
    setResetSent(false)
    setMessage("")
    setResetEmail("")
  }

  return (
    <>
      <Navbar />

      <main className="login-page">

        <section className="login-section">

          <div className="login-container">

            <div className="login-card">

              {!isForgotPassword ? (
                <>
                  <div className="login-card-header">

                    <span>
                      WELCOME BACK
                    </span>

                    <h1>
                      Continue your learning journey.
                    </h1>

                    <p>
                      Sign in to access your
                      courses, progress, quizzes,
                      and certificates.
                    </p>

                  </div>

                  <form
                    onSubmit={
                      handleSubmit
                    }
                  >

                    <div className="login-field">

                      <label htmlFor="login-email">
                        Email Address
                      </label>

                      <input
                        type="email"
                        id="login-email"
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

                    <div className="login-field">

                      <label htmlFor="login-password">
                        Password
                      </label>

                      <input
                        type="password"
                        id="login-password"
                        name="password"
                        placeholder="Enter your password"
                        value={
                          formData.password
                        }
                        onChange={
                          handleChange
                        }
                        autoComplete="current-password"
                      />

                    </div>

                    <div className="login-options">

                      <label>

                        <input
                          type="checkbox"
                          name="remember"
                        />

                        <span>
                          Remember me
                        </span>

                      </label>

                      <button
                        type="button"
                        className="forgot-password"
                        onClick={
                          showForgotPassword
                        }
                      >
                        Forgot password?
                      </button>

                    </div>

                    <button
                      type="submit"
                      className="login-submit"
                      disabled={
                        isLoading
                      }
                    >
                      {isLoading
                        ? "Signing In..."
                        : "Sign In"}
                    </button>

                    {message && (
                      <p className="login-message">
                        {message}
                      </p>
                    )}

                  </form>

                  <div className="login-register">

                    <p>
                      Don't have an account?
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        window.location.assign(
                          "/register"
                        )
                      }
                    >
                      Create Account
                    </button>

                  </div>
                </>
              ) : (
                <>
                  {!resetSent ? (
                    <>
                      <div className="login-card-header">

                        <span>
                          PASSWORD RECOVERY
                        </span>

                        <h1>
                          Reset your password.
                        </h1>

                        <p>
                          Enter your registered
                          email and we'll send
                          you a secure reset link.
                        </p>

                      </div>

                      <form
                        onSubmit={
                          handleForgotPassword
                        }
                      >

                        <div className="login-field">

                          <label htmlFor="reset-email">
                            Email Address
                          </label>

                          <input
                            type="email"
                            id="reset-email"
                            placeholder="Enter your registered email"
                            value={
                              resetEmail
                            }
                            onChange={(
                              event
                            ) =>
                              setResetEmail(
                                event.target
                                  .value
                              )
                            }
                            autoComplete="email"
                          />

                        </div>

                        <button
                          type="submit"
                          className="login-submit"
                          disabled={
                            isLoading
                          }
                        >
                          {isLoading
                            ? "Sending..."
                            : "Send Reset Link"}
                        </button>

                        {message && (
                          <p className="login-message">
                            {message}
                          </p>
                        )}

                      </form>

                      <div className="login-register">

                        <button
                          type="button"
                          onClick={
                            showLogin
                          }
                        >
                          ← Back to Login
                        </button>

                      </div>
                    </>
                  ) : (
                    <>
                      <div className="login-card-header">

                        <span>
                          CHECK YOUR EMAIL
                        </span>

                        <h1>
                          Reset link sent.
                        </h1>

                        <p>
                          If an account exists
                          with this email,
                          we've sent a password
                          reset link.
                        </p>

                      </div>

                      {message && (
                        <p className="login-message">
                          {message}
                        </p>
                      )}

                      <div className="login-register">

                        <button
                          type="button"
                          onClick={
                            showLogin
                          }
                        >
                          ← Back to Login
                        </button>

                      </div>
                    </>
                  )}
                </>
              )}

            </div>

            <div className="login-content">

              <div className="login-content-label">
                LEARNSPHERE PLATFORM
              </div>

              <h2>
                Learn today.
                <strong>
                  {" "}
                  Build tomorrow.
                </strong>
              </h2>

              <p>
                Access structured courses,
                learn from experienced
                instructors, track your
                progress, and earn certificates
                as you grow.
              </p>

              <div className="login-stats">

                <div className="login-stat">

                  <strong>
                    50K+
                  </strong>

                  <span>
                    Learners
                  </span>

                </div>

                <div className="login-stat">

                  <strong>
                    120+
                  </strong>

                  <span>
                    Courses
                  </span>

                </div>

                <div className="login-stat">

                  <strong>
                    40+
                  </strong>

                  <span>
                    Instructors
                  </span>

                </div>

              </div>

              <div className="login-feature-list">

                <div>

                  <span>
                    01
                  </span>

                  <p>
                    Industry-focused learning
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
                    Earn verified certificates
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

export default Login