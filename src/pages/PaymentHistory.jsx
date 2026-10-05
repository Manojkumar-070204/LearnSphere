import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function PaymentHistory() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
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

    let cancelled = false

    async function loadPaymentHistory() {
      try {
        setLoading(true)
        setError("")

        const response =
          await fetch(
            "http://localhost:5000/api/payment-history",
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

        if (cancelled) {
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              "Unable to load payment history."
          )
          return
        }

        setPayments(
          Array.isArray(
            data.payments
          )
            ? data.payments
            : []
        )
      } catch (requestError) {
        console.error(
          "Payment history error:",
          requestError
        )

        if (!cancelled) {
          setError(
            "Unable to load payment history."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPaymentHistory()

    return () => {
      cancelled = true
    }
  }, [])

  function formatDate(date) {
    if (!date) {
      return "—"
    }

    const formattedDate =
      new Date(date)

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "—"
    }

    return formattedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    )
  }

  function getPaymentStatus(payment) {
    const status =
      String(
        payment?.status || ""
      ).toLowerCase()

    if (
      status === "paid"
    ) {
      return "Paid"
    }

    if (
      status === "failed"
    ) {
      return "Failed"
    }

    if (
      status === "created"
    ) {
      return "Payment Created"
    }

    return (
      payment?.status ||
      "Paid"
    )
  }

  function getEnrollmentStatus(payment) {
    const status =
      String(
        payment?.enrollmentStatus ||
          ""
      ).toLowerCase()

    if (
      status === "pending"
    ) {
      return "Pending Approval"
    }

    if (
      status === "approved"
    ) {
      return "Approved"
    }

    if (
      status === "completed"
    ) {
      return "Completed"
    }

    if (
      status === "rejected"
    ) {
      return "Rejected"
    }

    return "—"
  }

  return (
    <>
      <Navbar />

      <main className="payment-history-page">

        <section className="dashboard-hero">

          <div className="dashboard-container">

            <div className="dashboard-hero-content">

              <span className="dashboard-eyebrow">
                PAYMENT HISTORY
              </span>

              <h1>
                Your payment{" "}
                <strong>
                  history.
                </strong>
              </h1>

              <p>
                View your course purchases and
                payment details in one place.
              </p>

            </div>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="dashboard-container">

            <div className="dashboard-section-heading">

              <div>

                <span>
                  TRANSACTIONS
                </span>

                <h2>
                  Payment History
                </h2>

              </div>

            </div>

            {loading ? (
              <div className="dashboard-no-results">

                <h3>
                  Loading payment history...
                </h3>

              </div>
            ) : error ? (
              <div className="dashboard-no-results">

                <h3>
                  Unable to load payments
                </h3>

                <p>
                  {error}
                </p>

              </div>
            ) : payments.length === 0 ? (
              <div className="dashboard-no-results">

                <h3>
                  No payments yet
                </h3>

                <p>
                  Your course payment history
                  will appear here after you
                  enroll in a course.
                </p>

                <button
                  type="button"
                  className="dashboard-primary-button"
                  onClick={() =>
                    window.location.assign(
                      "/courses"
                    )
                  }
                >
                  Explore Courses
                </button>

              </div>
            ) : (
              <div className="payment-history-list">

                {payments.map(
                  (payment, index) => (

                    <div
                      className="dashboard-course-card"
                      key={
                        payment.paymentId ||
                        payment.orderId ||
                        `${payment.courseId}-${index}`
                      }
                    >

                      <div className="dashboard-course-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="dashboard-course-content">

                        <div className="dashboard-course-top">

                          <span>
                            {payment.category ||
                              "Course Payment"}
                          </span>

                          <small>
                            {getPaymentStatus(
                              payment
                            )}
                          </small>

                        </div>

                        <h3>
                          {payment.courseTitle ||
                            payment.courseName ||
                            payment.courseId ||
                            "Course Payment"}
                        </h3>

                        <p>
                          Payment Date:{" "}
                          {formatDate(
                            payment.enrolledAt ||
                              payment.createdAt
                          )}
                        </p>

                        <p>
                          Order ID:{" "}
                          <strong>
                            {payment.orderId ||
                              "—"}
                          </strong>
                        </p>

                        <p>
                          Payment ID:{" "}
                          <strong>
                            {payment.paymentId ||
                              "—"}
                          </strong>
                        </p>

                        <p>
                          Enrollment Status:{" "}
                          <strong>
                            {getEnrollmentStatus(
                              payment
                            )}
                          </strong>
                        </p>

                      </div>

                      <div className="payment-history-amount">
                        ₹
                        {Number(
                          payment.amount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default PaymentHistory