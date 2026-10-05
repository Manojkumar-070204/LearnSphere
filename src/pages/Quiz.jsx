import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const quizCourses = {
  mern: {
    title: "MERN Stack Development",
    questions: [
      {
        question:
          "Which technology is used to build the frontend of a MERN application?",
        options: [
          "Node.js",
          "MongoDB",
          "React.js",
          "Express.js"
        ],
        answer: 2
      },
      {
        question:
          "Which database is used in the MERN stack?",
        options: [
          "MySQL",
          "MongoDB",
          "PostgreSQL",
          "Oracle"
        ],
        answer: 1
      },
      {
        question:
          "Which technology is used to create REST APIs in a MERN application?",
        options: [
          "Express.js",
          "React.js",
          "MongoDB",
          "HTML"
        ],
        answer: 0
      },
      {
        question:
          "What is Node.js primarily used for?",
        options: [
          "Database design",
          "Server-side JavaScript",
          "UI design",
          "Image editing"
        ],
        answer: 1
      },
      {
        question:
          "Which React hook is commonly used to manage component state?",
        options: [
          "useRoute",
          "useState",
          "useDatabase",
          "useServer"
        ],
        answer: 1
      },
      {
        question:
          "What format is commonly used for data exchanged through REST APIs?",
        options: [
          "JSON",
          "PSD",
          "MP4",
          "SVG"
        ],
        answer: 0
      },
      {
        question:
          "Which command is commonly used to start a Vite React application?",
        options: [
          "npm run dev",
          "npm run database",
          "npm start-server",
          "node react"
        ],
        answer: 0
      },
      {
        question:
          "What does CRUD stand for?",
        options: [
          "Create Read Update Delete",
          "Code Run Update Deploy",
          "Create React UI Design",
          "Connect Request Update Data"
        ],
        answer: 0
      },
      {
        question:
          "Which technology is used for authentication tokens in many MERN applications?",
        options: [
          "JWT",
          "CSS",
          "HTML",
          "SVG"
        ],
        answer: 0
      },
      {
        question:
          "Which language is primarily used across the MERN stack?",
        options: [
          "Java",
          "Python",
          "JavaScript",
          "C++"
        ],
        answer: 2
      }
    ]
  },

  frontend: {
    title: "Frontend Development with React",
    questions: [
      {
        question:
          "Which library is used to build the user interface?",
        options: [
          "React",
          "MongoDB",
          "Node.js",
          "Express"
        ],
        answer: 0
      },
      {
        question:
          "Which hook is used to manage state?",
        options: [
          "useState",
          "useRoute",
          "useData",
          "usePage"
        ],
        answer: 0
      },
      {
        question:
          "Which language provides structure for web pages?",
        options: [
          "CSS",
          "HTML",
          "JavaScript",
          "JSON"
        ],
        answer: 1
      },
      {
        question:
          "Which technology is mainly responsible for styling?",
        options: [
          "HTML",
          "CSS",
          "MongoDB",
          "Node.js"
        ],
        answer: 1
      },
      {
        question:
          "Which CSS layout system is useful for one-dimensional layouts?",
        options: [
          "Flexbox",
          "MongoDB",
          "React",
          "REST"
        ],
        answer: 0
      }
    ]
  },

  datascience: {
    title: "Data Science with Python",
    questions: [
      {
        question:
          "Which language is commonly used for data science?",
        options: [
          "Python",
          "HTML",
          "CSS",
          "PHP"
        ],
        answer: 0
      },
      {
        question:
          "Which library is commonly used for data manipulation?",
        options: [
          "Pandas",
          "React",
          "Express",
          "Node"
        ],
        answer: 0
      },
      {
        question:
          "Which library is commonly used for numerical computing?",
        options: [
          "NumPy",
          "React",
          "Express",
          "Bootstrap"
        ],
        answer: 0
      },
      {
        question:
          "What is machine learning mainly concerned with?",
        options: [
          "Learning patterns from data",
          "Designing web pages",
          "Editing images",
          "Creating CSS"
        ],
        answer: 0
      },
      {
        question:
          "Which step prepares raw data for analysis?",
        options: [
          "Data cleaning",
          "UI design",
          "Deployment",
          "Routing"
        ],
        answer: 0
      }
    ]
  },

  uiux: {
    title: "UI/UX Design Masterclass",
    questions: [
      {
        question:
          "What does UX stand for?",
        options: [
          "User Experience",
          "User Extension",
          "Universal Experience",
          "User Example"
        ],
        answer: 0
      },
      {
        question:
          "Which tool is commonly used for interface design?",
        options: [
          "Figma",
          "MongoDB",
          "Node.js",
          "Postman"
        ],
        answer: 0
      },
      {
        question:
          "What is a user persona?",
        options: [
          "A representation of a target user",
          "A database",
          "A programming language",
          "A server"
        ],
        answer: 0
      },
      {
        question:
          "What is a prototype?",
        options: [
          "An early interactive representation",
          "A database table",
          "A programming compiler",
          "A server"
        ],
        answer: 0
      },
      {
        question:
          "What is usability testing used for?",
        options: [
          "Evaluating how easily users can use a product",
          "Writing backend APIs",
          "Creating databases",
          "Deploying servers"
        ],
        answer: 0
      }
    ]
  },

  ai: {
    title: "Artificial Intelligence Fundamentals",
    questions: [
      {
        question:
          "What does AI stand for?",
        options: [
          "Artificial Intelligence",
          "Automated Interface",
          "Application Integration",
          "Advanced Internet"
        ],
        answer: 0
      },
      {
        question:
          "What is machine learning?",
        options: [
          "A method where systems learn patterns from data",
          "A CSS framework",
          "A database",
          "A design tool"
        ],
        answer: 0
      },
      {
        question:
          "Which language is widely used in AI development?",
        options: [
          "Python",
          "HTML",
          "CSS",
          "SQL only"
        ],
        answer: 0
      },
      {
        question:
          "What is a neural network?",
        options: [
          "A model inspired by interconnected neurons",
          "A CSS layout",
          "A database",
          "A browser"
        ],
        answer: 0
      },
      {
        question:
          "Why is training data important?",
        options: [
          "It helps models learn patterns",
          "It creates CSS",
          "It starts a server",
          "It designs interfaces"
        ],
        answer: 0
      }
    ]
  },

  cloud: {
    title: "Cloud & DevOps Engineering",
    questions: [
      {
        question:
          "What is cloud computing?",
        options: [
          "Delivery of computing services over the internet",
          "A programming language",
          "A UI library",
          "A database format"
        ],
        answer: 0
      },
      {
        question:
          "Which platform provides cloud services?",
        options: [
          "AWS",
          "React",
          "Figma",
          "MongoDB Compass"
        ],
        answer: 0
      },
      {
        question:
          "What is Docker used for?",
        options: [
          "Containerizing applications",
          "Designing logos",
          "Writing HTML",
          "Creating spreadsheets"
        ],
        answer: 0
      },
      {
        question:
          "What does CI/CD help automate?",
        options: [
          "Building and deploying applications",
          "Drawing UI designs",
          "Writing CSS only",
          "Editing images"
        ],
        answer: 0
      },
      {
        question:
          "What is a container?",
        options: [
          "A lightweight environment for running applications",
          "A database table",
          "A CSS component",
          "A browser extension"
        ],
        answer: 0
      }
    ]
  }
}

function Quiz() {
  const params = new URLSearchParams(
    window.location.search
  )

  const courseId =
    params.get("course") || "mern"

  const fallbackCourse =
    quizCourses[courseId]

  const [courseTitle, setCourseTitle] =
    useState(
      fallbackCourse?.title ||
        "Course Assessment"
    )

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [selectedAnswers, setSelectedAnswers] =
    useState({})

  const [showResult, setShowResult] =
    useState(false)

  const [score, setScore] =
    useState(0)

  const [loadingCourse, setLoadingCourse] =
    useState(
      !fallbackCourse
    )

  const [hasQuestions, setHasQuestions] =
    useState(
      Boolean(
        fallbackCourse?.questions?.length
      )
    )

  useEffect(() => {
    if (fallbackCourse) {
      return
    }

    let cancelled = false

    async function loadCourse() {
      try {
        const response =
          await fetch(
            `http://localhost:5000/api/courses/${courseId}`
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load course."
          )
        }

        if (!cancelled) {
          setCourseTitle(
            data.course?.title ||
              "Course Assessment"
          )

          setHasQuestions(false)
        }
      } catch (error) {
        console.error(
          "Quiz course loading error:",
          error
        )

        if (!cancelled) {
          setHasQuestions(false)
        }
      } finally {
        if (!cancelled) {
          setLoadingCourse(false)
        }
      }
    }

    loadCourse()

    return () => {
      cancelled = true
    }
  }, [
    courseId,
    fallbackCourse
  ])

  const courseQuestions =
    fallbackCourse?.questions || []

  const totalQuestions =
    courseQuestions.length

  const question =
    courseQuestions[
      currentQuestion
    ]

  function selectAnswer(index) {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: index
    })
  }

  function nextQuestion() {
    if (
      currentQuestion <
      totalQuestions - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      )
    } else {
      finishQuiz()
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      )
    }
  }

  function finishQuiz() {
    let finalScore = 0

    courseQuestions.forEach(
      (item, index) => {
        if (
          selectedAnswers[index] ===
          item.answer
        ) {
          finalScore++
        }
      }
    )

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (finalScore /
              totalQuestions) *
              100
          )
        : 0

    const passed =
      percentage >= 70

    setScore(finalScore)
    setShowResult(true)

    localStorage.setItem(
      `learnsphereQuiz_${courseId}`,
      JSON.stringify({
        score: finalScore,
        total: totalQuestions,
        percentage,
        passed,
        completed: true
      })
    )
  }

  function restartQuiz() {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResult(false)
    setScore(0)
  }

  function goToCertificate() {
    window.location.href =
      `/certificates?course=${courseId}`
  }

  function goToDashboard() {
    window.location.assign(
      "/dashboard"
    )
  }

  function goToLearning() {
    window.location.assign(
      `/learning?course=${courseId}`
    )
  }

  const answeredCount =
    Object.keys(
      selectedAnswers
    ).length

  const progress =
    totalQuestions > 0
      ? Math.round(
          ((currentQuestion + 1) /
            totalQuestions) *
            100
        )
      : 0

  if (loadingCourse) {
    return (
      <>
        <Navbar />

        <main className="quiz-page">

          <section className="quiz-result-section">

            <div className="quiz-result-card">

              <div className="quiz-result-icon">
                ...
              </div>

              <span className="quiz-result-label">
                COURSE ASSESSMENT
              </span>

              <h1>
                Loading Assessment
              </h1>

              <p className="quiz-result-course">
                Preparing {courseId}
              </p>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  if (!hasQuestions) {
    return (
      <>
        <Navbar />

        <main className="quiz-page">

          <section className="quiz-result-section">

            <div className="quiz-result-card">

              <div className="quiz-result-icon">
                !
              </div>

              <span className="quiz-result-label">
                COURSE ASSESSMENT
              </span>

              <h1>
                Assessment Not Available
              </h1>

              <p className="quiz-result-course">
                {courseTitle}
              </p>

              <div className="quiz-result-message">

                <p>
                  A final quiz has not been
                  added for this course yet.
                </p>

              </div>

              <div className="quiz-result-actions">

                <button
                  type="button"
                  className="quiz-primary-btn"
                  onClick={
                    goToLearning
                  }
                >
                  Back to Learning
                  <span>
                    →
                  </span>
                </button>

                <button
                  type="button"
                  className="quiz-secondary-btn"
                  onClick={
                    goToDashboard
                  }
                >
                  Go to Dashboard
                </button>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  if (showResult) {
    const percentage =
      totalQuestions > 0
        ? Math.round(
            (score /
              totalQuestions) *
              100
          )
        : 0

    const passed =
      percentage >= 70

    return (
      <>
        <Navbar />

        <main className="quiz-page">

          <section className="quiz-result-section">

            <div className="quiz-result-card">

              <div
                className={`quiz-result-icon ${
                  passed
                    ? "passed"
                    : "failed"
                }`}
              >
                {passed
                  ? "✓"
                  : "!"}
              </div>

              <span className="quiz-result-label">
                {passed
                  ? "ASSESSMENT COMPLETED"
                  : "ASSESSMENT INCOMPLETE"}
              </span>

              <h1>
                {passed
                  ? "Congratulations!"
                  : "Keep Learning"}
              </h1>

              <p className="quiz-result-course">
                {courseTitle}
              </p>

              <div className="quiz-score">

                <strong>
                  {percentage}%
                </strong>

                <span>
                  Your Score
                </span>

              </div>

              <div className="quiz-result-stats">

                <div>

                  <strong>
                    {score}
                  </strong>

                  <span>
                    Correct
                  </span>

                </div>

                <div>

                  <strong>
                    {totalQuestions -
                      score}
                  </strong>

                  <span>
                    Incorrect
                  </span>

                </div>

                <div>

                  <strong>
                    {totalQuestions}
                  </strong>

                  <span>
                    Questions
                  </span>

                </div>

              </div>

              <div className="quiz-result-message">

                {passed ? (
                  <p>
                    You have successfully
                    completed the assessment.
                    You can now continue to
                    your certificate.
                  </p>
                ) : (
                  <p>
                    A score of 70% is required
                    to complete the assessment.
                    Review the lessons and try
                    again.
                  </p>
                )}

              </div>

              <div className="quiz-result-actions">

                {passed && (
                  <button
                    type="button"
                    className="quiz-primary-btn"
                    onClick={
                      goToCertificate
                    }
                  >
                    View Certificate
                    <span>
                      →
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  className="quiz-secondary-btn"
                  onClick={
                    restartQuiz
                  }
                >
                  Retake Quiz
                </button>

              </div>

            </div>

          </section>

        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="quiz-page">

        <section className="quiz-header">

          <div className="quiz-header-container">

            <div>

              <span className="quiz-eyebrow">
                COURSE ASSESSMENT
              </span>

              <h1>
                {courseTitle}
              </h1>

              <p>
                Test your understanding of
                the concepts covered in this
                course.
              </p>

            </div>

            <div className="quiz-question-count">

              <strong>
                {currentQuestion + 1}
              </strong>

              <span>
                / {totalQuestions}
              </span>

            </div>

          </div>

        </section>

        <section className="quiz-workspace">

          <div className="quiz-progress-section">

            <div className="quiz-progress-top">

              <span>
                Assessment Progress
              </span>

              <strong>
                {progress}%
              </strong>

            </div>

            <div className="quiz-progress-bar">

              <span
                style={{
                  width: `${progress}%`
                }}
              ></span>

            </div>

          </div>

          <div className="quiz-content">

            <div className="quiz-question-number">
              QUESTION{" "}
              {String(
                currentQuestion + 1
              ).padStart(
                2,
                "0"
              )}
            </div>

            <h2>
              {question.question}
            </h2>

            <div className="quiz-options">

              {question.options.map(
                (
                  option,
                  index
                ) => {

                  const selected =
                    selectedAnswers[
                      currentQuestion
                    ] === index

                  return (
                    <button
                      type="button"
                      key={option}
                      className={`quiz-option ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectAnswer(
                          index
                        )
                      }
                    >

                      <span className="quiz-option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="quiz-option-text">
                        {option}
                      </span>

                      <span className="quiz-option-check">
                        {selected
                          ? "✓"
                          : ""}
                      </span>

                    </button>
                  )
                }
              )}

            </div>

            <div className="quiz-footer">

              <span>
                {answeredCount} of{" "}
                {totalQuestions}{" "}
                answered
              </span>

              <div className="quiz-navigation">

                <button
                  type="button"
                  className="quiz-back-btn"
                  onClick={
                    previousQuestion
                  }
                  disabled={
                    currentQuestion ===
                    0
                  }
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  className="quiz-next-btn"
                  onClick={
                    nextQuestion
                  }
                  disabled={
                    selectedAnswers[
                      currentQuestion
                    ] === undefined
                  }
                >
                  {currentQuestion ===
                  totalQuestions - 1
                    ? "Finish Quiz"
                    : "Next Question"}

                  <span>
                    →
                  </span>

                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Quiz