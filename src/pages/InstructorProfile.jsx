import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function getInitialForm() {
  return {
    name: "",
    email: "",
    photo: "",
    bio: "",
    expertise: "",
    experience: ""
  }
}

function InstructorProfile() {
  const [profile, setProfile] =
    useState(null)

  const [formData, setFormData] =
    useState(getInitialForm())

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      const token =
        localStorage.getItem(
          "learnsphereToken"
        )

      if (!token) {
        window.location.assign(
          "/login"
        )
        return
      }

      try {
        const response =
          await fetch(
            "http://localhost:5000/api/instructor/profile",
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
              "Unable to load instructor profile."
          )
        }

        if (!cancelled) {
          const instructor =
            data.instructor || {}

          setProfile(
            instructor
          )

          setFormData({
            name:
              instructor.name ||
              "",
            email:
              instructor.email ||
              "",
            photo:
              instructor.photo ||
              "",
            bio:
              instructor.bio ||
              "",
            expertise:
              instructor.expertise ||
              "",
            experience:
              instructor.experience ||
              ""
          })
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(event) {
    setFormData(
      (currentData) => ({
        ...currentData,
        [event.target.name]:
          event.target.value
      })
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setSuccess("")
    setSaving(true)

    try {
      const token =
        localStorage.getItem(
          "learnsphereToken"
        )

      const response =
        await fetch(
          "http://localhost:5000/api/instructor/profile",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              name:
                formData.name,
              email:
                formData.email,
              photo:
                formData.photo,
              bio:
                formData.bio,
              expertise:
                formData.expertise,
              experience:
                formData.experience
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update instructor profile."
        )
      }

      setProfile(
        data.instructor
      )

      setFormData({
        name:
          data.instructor?.name ||
          "",
        email:
          data.instructor?.email ||
          "",
        photo:
          data.instructor?.photo ||
          "",
        bio:
          data.instructor?.bio ||
          "",
        expertise:
          data.instructor?.expertise ||
          "",
        experience:
          data.instructor?.experience ||
          ""
      })

      const storedUser =
        localStorage.getItem(
          "learnsphereUser"
        )

      if (storedUser) {
        try {
          const user =
            JSON.parse(
              storedUser
            )

          localStorage.setItem(
            "learnsphereUser",
            JSON.stringify({
              ...user,
              name:
                data.instructor?.name ||
                user.name,
              email:
                data.instructor?.email ||
                user.email,
              photo:
                data.instructor?.photo ||
                user.photo
            })
          )
        } catch {
          // Keep existing stored authentication data.
        }
      }

      setSuccess(
        "Instructor profile updated successfully."
      )
    } catch (saveError) {
      setError(
        saveError.message
      )
    } finally {
      setSaving(false)
    }
  }

  function goDashboard() {
    window.location.assign(
      "/instructor-dashboard"
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="instructor-page">

          <div className="instructor-container instructor-loading">

            <div className="instructor-loading-spinner"></div>

            <p>
              Loading instructor profile...
            </p>

          </div>

        </main>

        <Footer />
      </>
    )
  }

  const initials =
    profile?.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "I"

  return (
    <>
      <Navbar />

      <main className="instructor-page">

        <div className="instructor-container">

          <div className="instructor-header">

            <div>

              <span className="instructor-eyebrow">
                INSTRUCTOR PROFILE
              </span>

              <h1>
                Manage Your Profile
              </h1>

              <p>
                Keep your instructor information
                current for students and course
                visitors.
              </p>

            </div>

            <button
              type="button"
              className="instructor-btn instructor-btn-secondary"
              onClick={
                goDashboard
              }
            >
              ← Dashboard
            </button>

          </div>

          {error && (
            <div className="instructor-alert instructor-alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="instructor-alert instructor-alert-success">
              {success}
            </div>
          )}

          <section className="instructor-section">

            <div className="instructor-profile-header">

              <div className="instructor-profile-avatar">

                {formData.photo ? (
                  <img
                    src={
                      formData.photo
                    }
                    alt={
                      formData.name ||
                      "Instructor"
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "100%",
                      objectFit:
                        "cover",
                      borderRadius:
                        "inherit"
                    }}
                    onError={(
                      event
                    ) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />
                ) : (
                  initials
                )}

              </div>

              <div className="instructor-profile-main">

                <span className="instructor-profile-category">
                  INSTRUCTOR
                </span>

                <h1>
                  {profile?.name ||
                    "Instructor"}
                </h1>

                <h2>
                  {profile?.email ||
                    "—"}
                </h2>

                <p>
                  {profile?.bio ||
                    "Add a short professional bio to introduce yourself to students."}
                </p>

              </div>

            </div>

          </section>

          <section className="instructor-section">

            <div className="instructor-section-header">

              <div>

                <span className="instructor-eyebrow">
                  PROFILE INFORMATION
                </span>

                <h2>
                  Update Profile
                </h2>

              </div>

            </div>

            <form
              className="instructor-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="instructor-form-grid">

                <div className="instructor-form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter your full name"
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter your email"
                  />

                </div>

                <div className="instructor-form-group instructor-form-full">

                  <label>
                    Profile Photo URL
                  </label>

                  <input
                    type="url"
                    name="photo"
                    value={
                      formData.photo
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://example.com/profile.jpg"
                  />

                </div>

                <div className="instructor-form-group instructor-form-full">

                  <label>
                    Professional Bio
                  </label>

                  <textarea
                    name="bio"
                    value={
                      formData.bio
                    }
                    onChange={
                      handleChange
                    }
                    rows="5"
                    placeholder="Tell students about your teaching experience and background."
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Expertise
                  </label>

                  <input
                    type="text"
                    name="expertise"
                    value={
                      formData.expertise
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: React, Node.js, MongoDB"
                  />

                </div>

                <div className="instructor-form-group">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={
                      formData.experience
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: 8+ years"
                  />

                </div>

              </div>

              <div className="instructor-form-actions">

                <button
                  type="submit"
                  className="instructor-btn instructor-btn-primary"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>

                <button
                  type="button"
                  className="instructor-btn instructor-btn-secondary"
                  onClick={
                    goDashboard
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

          <section className="instructor-section">

            <div className="instructor-section-header">

              <div>

                <span className="instructor-eyebrow">
                  PROFILE OVERVIEW
                </span>

                <h2>
                  Your Instructor Stats
                </h2>

              </div>

            </div>

            <div className="instructor-stat-grid">

              <div className="instructor-stat-card">

                <strong>
                  {profile?.courseCount ||
                    0}
                </strong>

                <span>
                  Total Courses
                </span>

              </div>

              <div className="instructor-stat-card">

                <strong>
                  {profile?.studentCount ||
                    0}
                </strong>

                <span>
                  Students
                </span>

              </div>

              <div className="instructor-stat-card">

                <strong>
                  {profile?.experience ||
                    "—"}
                </strong>

                <span>
                  Experience
                </span>

              </div>

              <div className="instructor-stat-card">

                <strong>
                  {profile?.disabled
                    ? "Disabled"
                    : "Active"}
                </strong>

                <span>
                  Account Status
                </span>

              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  )
}

export default InstructorProfile