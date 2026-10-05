import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function ResetPassword() {
  const [password, setPassword] =
    useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [error, setError] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const params =
    new URLSearchParams(
      window.location.search
    )

  const token =
    params.get("token")

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")

    if (!token) {
      setError(
        "Invalid or missing password reset link."
      )
      return
    }

    if (
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please enter both password fields."
      )
      return
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      )
      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      )
      return
    }

    try {
      setLoading(true)

      const response =
        await fetch(
          `http://localhost:5000/api/auth/reset-password/${encodeURIComponent(
            token
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              password
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to reset password."
        )
        return
      }

      setSuccess(true)
      setPassword("")
      setConfirmPassword("")
    } catch (requestError) {
      console.error(
        "Reset password error:",
        requestError
      )

      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  function goToLogin() {
    window.location.assign(
      "/login"
    )
  }

  return (
    <>
      <Navbar />

      <main className="reset-password-page">

        <div className="reset-password-card">

          {!success ? (
            <>
              <div className="reset-password-header">

                <span>
                  PASSWORD RECOVERY
                </span>

                <h1>
                  Reset Password
                </h1>

                <p>
                  Create a new password for
                  your LearnSphere account.
                </p>

              </div>

              {!token && (
                <div className="reset-error">
                  Invalid or missing password
                  reset link.
                </div>
              )}

              {token && (
                <form
                  onSubmit={
                    handleSubmit
                  }
                >

                  <div className="reset-form-group">

                    <label htmlFor="new-password">
                      New Password
                    </label>

                    <input
                      type="password"
                      id="new-password"
                      value={
                        password
                      }
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />

                  </div>

                  <div className="reset-form-group">

                    <label htmlFor="confirm-password">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      id="confirm-password"
                      value={
                        confirmPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />

                  </div>

                  {error && (
                    <div className="reset-error">
                      {
                        error
                      }
                    </div>
                  )}

                  <button
                    type="submit"
                    className="reset-password-button"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? "Updating..."
                      : "Update Password"}
                  </button>

                </form>
              )}

              {!token && (
                <button
                  type="button"
                  className="reset-password-button"
                  onClick={
                    goToLogin
                  }
                >
                  Back to Login
                </button>
              )}
            </>
          ) : (
            <div className="reset-success">

              <div className="reset-success-icon">
                ✓
              </div>

              <h1>
                Password Updated
              </h1>

              <p>
                Your LearnSphere password
                has been reset successfully.
              </p>

              <button
                type="button"
                className="reset-password-button"
                onClick={
                  goToLogin
                }
              >
                Go to Login
              </button>

            </div>
          )}

        </div>

      </main>

      <Footer />
    </>
  )
}

export default ResetPassword