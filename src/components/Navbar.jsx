import { useState } from "react"

function getStoredUser() {
  const storedUser =
    localStorage.getItem(
      "learnsphereUser"
    )

  if (!storedUser) {
    return {}
  }

  try {
    return (
      JSON.parse(
        storedUser
      ) || {}
    )
  } catch {
    return {}
  }
}

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(
      localStorage.getItem(
        "learnsphereAuth"
      ) === "true" &&
        Boolean(
          localStorage.getItem(
            "learnsphereToken"
          )
        )
    )

  const [menuOpen, setMenuOpen] =
    useState(false)

  const user =
    getStoredUser()

  const role =
    user?.role || "student"

  function handleLogout() {
    localStorage.removeItem(
      "learnsphereAuth"
    )

    localStorage.removeItem(
      "learnsphereToken"
    )

    localStorage.removeItem(
      "learnsphereUser"
    )

    setIsAuthenticated(false)
    setMenuOpen(false)

    window.location.assign(
      "/login"
    )
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function goToDashboard() {
    closeMenu()

    if (role === "admin") {
      window.location.assign(
        "/admin"
      )
      return
    }

    if (role === "instructor") {
      window.location.assign(
        "/instructor-dashboard"
      )
      return
    }

    window.location.assign(
      "/dashboard"
    )
  }

  function goToProfile() {
    closeMenu()

    window.location.assign(
      "/instructor-profile"
    )
  }

  function goToPaymentHistory() {
    closeMenu()

    window.location.assign(
      "/payment-history"
    )
  }

  return (
    <header className="navbar">

      <div className="nav-container">

        <a
          href="/"
          className="logo"
          onClick={
            closeMenu
          }
        >
          Learn<span>Sphere</span>
        </a>

        <nav
          className={`nav-links ${
            menuOpen
              ? "mobile-open"
              : ""
          }`}
        >

          <a
            href="/"
            onClick={
              closeMenu
            }
          >
            Home
          </a>

          <a
            href="/courses"
            onClick={
              closeMenu
            }
          >
            Courses
          </a>

          <a
            href="/instructors"
            onClick={
              closeMenu
            }
          >
            Instructors
          </a>

          <a
            href="/about"
            onClick={
              closeMenu
            }
          >
            About
          </a>

          <a
            href="/contact"
            onClick={
              closeMenu
            }
          >
            Contact
          </a>

          <div className="mobile-nav-actions">

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="mobile-dashboard-btn"
                  onClick={
                    goToDashboard
                  }
                >
                  {role === "admin"
                    ? "Admin Dashboard"
                    : role ===
                        "instructor"
                      ? "Instructor Dashboard"
                      : "Dashboard"}
                </button>

                {role ===
                  "instructor" && (
                  <button
                    type="button"
                    className="mobile-dashboard-btn"
                    onClick={
                      goToProfile
                    }
                  >
                    Instructor Profile
                  </button>
                )}

                {role ===
                  "student" && (
                  <button
                    type="button"
                    className="mobile-dashboard-btn"
                    onClick={
                      goToPaymentHistory
                    }
                  >
                    Payment History
                  </button>
                )}

                <button
                  type="button"
                  className="mobile-logout-btn"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="mobile-login-btn"
                  onClick={() => {
                    closeMenu()

                    window.location.assign(
                      "/login"
                    )
                  }}
                >
                  Login
                </button>

                <button
                  type="button"
                  className="mobile-signup-btn"
                  onClick={() => {
                    closeMenu()

                    window.location.assign(
                      "/register"
                    )
                  }}
                >
                  Get Started
                </button>
              </>
            )}

          </div>

        </nav>

        <div className="nav-actions">

          {isAuthenticated ? (
            <>
              <button
                className="login-btn"
                type="button"
                onClick={
                  goToDashboard
                }
              >
                {role === "admin"
                  ? "Admin Dashboard"
                  : role ===
                      "instructor"
                    ? "Instructor Dashboard"
                    : "Dashboard"}
              </button>

              {role ===
                "instructor" && (
                <button
                  className="login-btn"
                  type="button"
                  onClick={
                    goToProfile
                  }
                >
                  Profile
                </button>
              )}

              {role ===
                "student" && (
                <button
                  className="login-btn"
                  type="button"
                  onClick={
                    goToPaymentHistory
                  }
                >
                  Payment History
                </button>
              )}

              <button
                className="signup-btn"
                type="button"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"
                type="button"
                onClick={() =>
                  window.location.assign(
                    "/login"
                  )
                }
              >
                Login
              </button>

              <button
                className="signup-btn"
                type="button"
                onClick={() =>
                  window.location.assign(
                    "/register"
                  )
                }
              >
                Get Started
              </button>
            </>
          )}

        </div>

        <button
          type="button"
          className={`hamburger-btn ${
            menuOpen
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
          aria-label="Toggle navigation menu"
          aria-expanded={
            menuOpen
          }
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

    </header>
  )
}

export default Navbar