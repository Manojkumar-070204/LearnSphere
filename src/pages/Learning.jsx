import { useCallback, useEffect, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import mernImage from "../assets/courses/mern.svg"
import frontendImage from "../assets/courses/frontend.svg"
import pythonImage from "../assets/courses/python.svg"
import uiuxImage from "../assets/courses/uiux.svg"
import aiImage from "../assets/courses/aif.svg"
import cloudImage from "../assets/courses/aws-cloud.png"

const learningCourses = {
  mern: {
    title: "MERN Stack Development",
    instructor: "Arjun Sharma",
    category: "Web Development",
    image: mernImage,
    modules: [
      {
        id: "01",
        title: "Frontend Development with React",
        lessons: [
          {
            title: "Introduction to React",
            description:
              "Understand React, component-based development and how React applications are structured.",
            duration: "18 min",
            videoId: "bMknfKXIFA8"
          },
          {
            title: "React Components",
            description:
              "Learn how reusable React components are created and organized in modern applications.",
            duration: "24 min",
            videoId: "SqcY0GlETPk"
          },
          {
            title: "Props and State",
            description:
              "Understand how data moves between components using props and how state manages dynamic data.",
            duration: "27 min",
            videoId: "Oe421EPjeBE"
          },
          {
            title: "React Hooks",
            description:
              "Learn the fundamentals of useState, useEffect and practical hook-based development.",
            duration: "31 min",
            videoId: "O5mXfaSohBI"
          },
          {
            title: "React Forms",
            description:
              "Build interactive forms and manage user input using React state and event handling.",
            duration: "25 min",
            videoId: "w7ejDZ8SWv8"
          }
        ]
      },
      {
        id: "02",
        title: "Node.js & Express.js",
        lessons: [
          {
            title: "Introduction to Node.js",
            description:
              "Understand Node.js and how JavaScript can be used for server-side development.",
            duration: "20 min",
            videoId: "qwfE7fSVaZM"
          },
          {
            title: "Express.js Fundamentals",
            description:
              "Create Express applications and understand routes, requests and responses.",
            duration: "26 min",
            videoId: "L72fhGm1tfE"
          },
          {
            title: "Building REST APIs",
            description:
              "Learn how to design and implement RESTful APIs using Node.js and Express.",
            duration: "32 min",
            videoId: "_7UQPve99r4"
          },
          {
            title: "API Error Handling",
            description:
              "Handle API errors and create reliable backend request flows.",
            duration: "23 min",
            videoId: "zFQHn1nk-uw"
          }
        ]
      },
      {
        id: "03",
        title: "MongoDB Database",
        lessons: [
          {
            title: "MongoDB Fundamentals",
            description:
              "Understand databases, collections, documents and MongoDB fundamentals.",
            duration: "21 min",
            videoId: "ofme2o29ngU"
          },
          {
            title: "CRUD Operations",
            description:
              "Create, read, update and delete MongoDB documents using practical examples.",
            duration: "29 min",
            videoId: "CyTWPr_WwdI"
          },
          {
            title: "MongoDB with Node.js",
            description:
              "Connect a Node.js application to MongoDB and work with stored application data.",
            duration: "30 min",
            videoId: "_7UQPve99r4"
          }
        ]
      },
      {
        id: "04",
        title: "Authentication & Security",
        lessons: [
          {
            title: "Authentication Fundamentals",
            description:
              "Understand user authentication and secure application access.",
            duration: "19 min",
            videoId: "mbsmsi7lWfM"
          },
          {
            title: "JWT Authentication",
            description:
              "Learn how JSON Web Tokens are used for authenticated application requests.",
            duration: "28 min",
            videoId: "favjC6EKFgw"
          },
          {
            title: "Role-Based Access",
            description:
              "Implement access rules for different types of application users.",
            duration: "24 min",
            videoId: "HHuiV841g_w"
          }
        ]
      },
      {
        id: "05",
        title: "Full Stack Project",
        lessons: [
          {
            title: "Project Planning",
            description:
              "Plan the architecture, features and development workflow of a complete MERN project.",
            duration: "22 min",
            videoId: "hQAHSlTtcmY"
          },
          {
            title: "Frontend Implementation",
            description:
              "Build the main React interface and connect the required application components.",
            duration: "34 min",
            videoId: "Ke90Tje7VS0"
          },
          {
            title: "Backend Integration",
            description:
              "Connect the frontend application with REST APIs and backend services.",
            duration: "36 min",
            videoId: "TlB_eWDSMt4"
          },
          {
            title: "Project Deployment",
            description:
              "Understand the basic workflow for preparing and deploying a full-stack application.",
            duration: "29 min",
            videoId: "R8_veQiYBjI"
          }
        ]
      }
    ]
  },

  frontend: {
    title: "Frontend Development with React",
    instructor: "Ananya Rao",
    category: "Web Development",
    image: frontendImage,
    modules: [
      {
        id: "01",
        title: "Modern JavaScript",
        lessons: [
          {
            title: "JavaScript Fundamentals",
            description:
              "Review variables, data types, operators and basic JavaScript concepts.",
            duration: "20 min",
            videoId: "PkZNo7MFNFg"
          },
          {
            title: "Arrays and Objects",
            description:
              "Work with JavaScript arrays and objects using practical examples.",
            duration: "25 min",
            videoId: "TceCkM0P8T0"
          },
          {
            title: "Functions and Callbacks",
            description:
              "Understand functions, callbacks and reusable JavaScript logic.",
            duration: "27 min",
            videoId: "N8ap4k_1QEQ"
          },
          {
            title: "Asynchronous JavaScript",
            description:
              "Learn promises, async functions and asynchronous application workflows.",
            duration: "30 min",
            videoId: "PoRJizFvM7s"
          }
        ]
      },
      {
        id: "02",
        title: "React Fundamentals",
        lessons: [
          {
            title: "React Introduction",
            description:
              "Understand React and component-based frontend development.",
            duration: "18 min",
            videoId: "DLX62G4lc44"
          },
          {
            title: "Components and Props",
            description:
              "Create reusable components and pass data using props.",
            duration: "24 min",
            videoId: "Tn6-PIqc4UM"
          },
          {
            title: "State and Events",
            description:
              "Manage component state and respond to user interactions.",
            duration: "27 min",
            videoId: "O6P86uwfdR0"
          },
          {
            title: "React Hooks",
            description:
              "Learn the most commonly used React hooks.",
            duration: "30 min",
            videoId: "O5mXfaSohBI"
          }
        ]
      },
      {
        id: "03",
        title: "Responsive UI Development",
        lessons: [
          {
            title: "CSS Layouts",
            description:
              "Build structured interfaces using modern CSS layout techniques.",
            duration: "24 min",
            videoId: "1Rs2ND1ryYc"
          },
          {
            title: "Flexbox and Grid",
            description:
              "Create flexible and responsive layouts using Flexbox and CSS Grid.",
            duration: "29 min",
            videoId: "nbsz6muQRT4"
          },
          {
            title: "Responsive Design",
            description:
              "Design interfaces that work across desktop, tablet and mobile screens.",
            duration: "26 min",
            videoId: "srvUrASNj0s"
          }
        ]
      },
      {
        id: "04",
        title: "API Integration",
        lessons: [
          {
            title: "Working with REST APIs",
            description:
              "Understand how frontend applications communicate with backend APIs.",
            duration: "25 min",
            videoId: "xNT6WE7EgfM"
          },
          {
            title: "Fetch API",
            description:
              "Fetch and display data from APIs inside React applications.",
            duration: "28 min",
            videoId: "cA3dmWPAjmY"
          },
          {
            title: "Loading and Error States",
            description:
              "Create better user experiences with loading and error handling.",
            duration: "22 min",
            videoId: "oU2Y4r9z3kw"
          }
        ]
      },
      {
        id: "05",
        title: "Frontend Project",
        lessons: [
          {
            title: "Project Setup",
            description:
              "Set up the structure and development workflow for a React project.",
            duration: "20 min",
            videoId: "K8YELRmUb5o"
          },
          {
            title: "Building the Interface",
            description:
              "Create the main responsive interface using React and CSS.",
            duration: "34 min",
            videoId: "bMknfKXIFA8"
          },
          {
            title: "Final Improvements",
            description:
              "Improve usability, responsiveness and application structure.",
            duration: "28 min",
            videoId: "SqcY0GlETPk"
          }
        ]
      }
    ]
  },

  datascience: {
    title: "Data Science with Python",
    instructor: "Rahul Mehta",
    category: "Data Science",
    image: pythonImage,
    modules: [
      {
        id: "01",
        title: "Python for Data Science",
        lessons: [
          {
            title: "Python Fundamentals",
            description:
              "Review Python syntax, variables, conditions and loops.",
            duration: "24 min",
            videoId: "rfscVS0vtbw"
          },
          {
            title: "Python Collections",
            description:
              "Work with lists, tuples, dictionaries and sets.",
            duration: "26 min",
            videoId: "R-HLU1cE1WQ"
          },
          {
            title: "Functions and Modules",
            description:
              "Create reusable Python functions and organize code with modules.",
            duration: "25 min",
            videoId: "9Os0o3wzS_I"
          }
        ]
      },
      {
        id: "02",
        title: "NumPy & Pandas",
        lessons: [
          {
            title: "NumPy Fundamentals",
            description:
              "Understand arrays and numerical operations with NumPy.",
            duration: "28 min",
            videoId: "QUT1VHiLmmI"
          },
          {
            title: "Pandas DataFrames",
            description:
              "Create and work with Pandas DataFrames.",
            duration: "31 min",
            videoId: "vmEHCJofslg"
          },
          {
            title: "Data Cleaning",
            description:
              "Clean missing, duplicate and inconsistent data.",
            duration: "30 min",
            videoId: "bDhvCp3_lYw"
          }
        ]
      },
      {
        id: "03",
        title: "Data Visualization",
        lessons: [
          {
            title: "Visualization Fundamentals",
            description:
              "Understand how data visualization communicates patterns and insights.",
            duration: "20 min",
            videoId: "r-uOLxNrNk8"
          },
          {
            title: "Charts and Graphs",
            description:
              "Create meaningful charts for different types of datasets.",
            duration: "28 min",
            videoId: "LHBE6Q9XlzI"
          },
          {
            title: "Presenting Insights",
            description:
              "Learn how to communicate data-driven findings clearly.",
            duration: "22 min",
            videoId: "CMEWVn1uZpQ"
          }
        ]
      },
      {
        id: "04",
        title: "Machine Learning Basics",
        lessons: [
          {
            title: "Machine Learning Introduction",
            description:
              "Understand the basic concepts behind machine learning.",
            duration: "23 min",
            videoId: "7eh4d6sabA0"
          },
          {
            title: "Supervised Learning",
            description:
              "Explore supervised learning and common model types.",
            duration: "30 min",
            videoId: "osa03zFjL3c"
          },
          {
            title: "Model Evaluation",
            description:
              "Understand training, testing and basic model evaluation.",
            duration: "27 min",
            videoId: "aircAruvnKk"
          }
        ]
      },
      {
        id: "05",
        title: "Data Science Project",
        lessons: [
          {
            title: "Dataset Preparation",
            description:
              "Prepare a real-world dataset for analysis.",
            duration: "28 min",
            videoId: "GPVsHOlRBBI"
          },
          {
            title: "Data Analysis",
            description:
              "Analyze the dataset and identify useful patterns.",
            duration: "35 min",
            videoId: "r-uOLxNrNk8"
          },
          {
            title: "Project Presentation",
            description:
              "Present the analysis and communicate the final insights.",
            duration: "26 min",
            videoId: "LHBE6Q9XlzI"
          }
        ]
      }
    ]
  },

  uiux: {
    title: "UI/UX Design Masterclass",
    instructor: "Priya Nair",
    category: "UI / UX Design",
    image: uiuxImage,
    modules: [
      {
        id: "01",
        title: "UX Fundamentals",
        lessons: [
          {
            title: "Introduction to UX",
            description:
              "Understand user experience and user-centered product design.",
            duration: "20 min",
            videoId: "shuIfhrLIP0"
          },
          {
            title: "Design Thinking",
            description:
              "Learn the main stages of design thinking.",
            duration: "25 min",
            videoId: "5ZG_1WJEgu4"
          },
          {
            title: "Understanding Users",
            description:
              "Identify user needs and product problems.",
            duration: "24 min",
            videoId: "_kUcZq3HT0c"
          }
        ]
      },
      {
        id: "02",
        title: "Research & User Flows",
        lessons: [
          {
            title: "UX Research",
            description:
              "Understand practical approaches to user research.",
            duration: "28 min",
            videoId: "9BdtGjoIN4E"
          },
          {
            title: "Personas",
            description:
              "Create useful user personas for product design.",
            duration: "22 min",
            videoId: "NqDqA9N9g9U"
          },
          {
            title: "User Flows",
            description:
              "Map the journey users follow through a product.",
            duration: "26 min",
            videoId: "X5QmV2G4L1E"
          }
        ]
      },
      {
        id: "03",
        title: "Figma UI Design",
        lessons: [
          {
            title: "Figma Fundamentals",
            description:
              "Learn the main tools and workspace in Figma.",
            duration: "24 min",
            videoId: "FTFaQWZBqQ8"
          },
          {
            title: "Design Systems",
            description:
              "Create reusable components and consistent visual systems.",
            duration: "30 min",
            videoId: "shuIfhrLIP0"
          },
          {
            title: "Interface Design",
            description:
              "Design polished interfaces using Figma.",
            duration: "34 min",
            videoId: "5ZG_1WJEgu4"
          }
        ]
      },
      {
        id: "04",
        title: "Prototyping",
        lessons: [
          {
            title: "Interactive Prototypes",
            description:
              "Create interactive product prototypes in Figma.",
            duration: "28 min",
            videoId: "_kUcZq3HT0c"
          },
          {
            title: "Usability Testing",
            description:
              "Understand usability testing and design feedback.",
            duration: "24 min",
            videoId: "O5mXfaSohBI"
          }
        ]
      },
      {
        id: "05",
        title: "Portfolio Project",
        lessons: [
          {
            title: "Case Study Planning",
            description:
              "Plan a professional UI/UX case study.",
            duration: "22 min",
            videoId: "9BdtGjoIN4E"
          },
          {
            title: "Final Portfolio Design",
            description:
              "Prepare and present a complete product design.",
            duration: "35 min",
            videoId: "shuIfhrLIP0"
          }
        ]
      }
    ]
  },

  ai: {
    title: "Artificial Intelligence Fundamentals",
    instructor: "Vikram Singh",
    category: "Artificial Intelligence",
    image: aiImage,
    modules: [
      {
        id: "01",
        title: "Introduction to AI",
        lessons: [
          {
            title: "What is Artificial Intelligence?",
            description:
              "Understand artificial intelligence and its major applications.",
            duration: "20 min",
            videoId: "2ePf9rue1Ao"
          },
          {
            title: "AI Problem Solving",
            description:
              "Explore how AI systems approach different problems.",
            duration: "24 min",
            videoId: "ad79nYk2keg"
          },
          {
            title: "AI Applications",
            description:
              "Explore practical applications of AI across industries.",
            duration: "22 min",
            videoId: "5qfK2m2hZ8M"
          }
        ]
      },
      {
        id: "02",
        title: "Python for AI",
        lessons: [
          {
            title: "Python for AI",
            description:
              "Review Python concepts used in AI development.",
            duration: "25 min",
            videoId: "rfscVS0vtbw"
          },
          {
            title: "Data Preparation",
            description:
              "Prepare data for machine learning workflows.",
            duration: "29 min",
            videoId: "bDhvCp3_lYw"
          },
          {
            title: "Working with Data",
            description:
              "Process and organize data for AI applications.",
            duration: "28 min",
            videoId: "vmEHCJofslg"
          }
        ]
      },
      {
        id: "03",
        title: "Machine Learning",
        lessons: [
          {
            title: "Machine Learning Fundamentals",
            description:
              "Understand the core concepts of machine learning.",
            duration: "27 min",
            videoId: "7eh4d6sabA0"
          },
          {
            title: "Training Models",
            description:
              "Understand how machine learning models are trained.",
            duration: "31 min",
            videoId: "osa03zFjL3c"
          },
          {
            title: "Testing Models",
            description:
              "Evaluate machine learning models using test data.",
            duration: "26 min",
            videoId: "aircAruvnKk"
          }
        ]
      },
      {
        id: "04",
        title: "Neural Networks",
        lessons: [
          {
            title: "Neural Network Concepts",
            description:
              "Understand neurons, layers and basic neural network architecture.",
            duration: "28 min",
            videoId: "aircAruvnKk"
          },
          {
            title: "Deep Learning Fundamentals",
            description:
              "Explore the fundamentals of deep learning.",
            duration: "30 min",
            videoId: "IHZwWFHWa-w"
          }
        ]
      },
      {
        id: "05",
        title: "AI Project",
        lessons: [
          {
            title: "Project Planning",
            description:
              "Plan a practical AI application.",
            duration: "22 min",
            videoId: "2ePf9rue1Ao"
          },
          {
            title: "Building the AI Application",
            description:
              "Apply the concepts learned throughout the course.",
            duration: "36 min",
            videoId: "5qfK2m2hZ8M"
          }
        ]
      }
    ]
  },

  cloud: {
    title: "Cloud & DevOps Engineering",
    instructor: "Karan Verma",
    category: "Cloud & DevOps",
    image: cloudImage,
    modules: [
      {
        id: "01",
        title: "Cloud Fundamentals",
        lessons: [
          {
            title: "Introduction to Cloud Computing",
            description:
              "Understand cloud computing concepts and service models.",
            duration: "22 min",
            videoId: "M988_fsOSWo"
          },
          {
            title: "Cloud Architecture",
            description:
              "Learn the basic architecture of cloud platforms.",
            duration: "26 min",
            videoId: "3hLmDS179YE"
          },
          {
            title: "Cloud Services",
            description:
              "Explore common cloud service categories.",
            duration: "24 min",
            videoId: "2LaAJq1lB1Q"
          }
        ]
      },
      {
        id: "02",
        title: "AWS Essentials",
        lessons: [
          {
            title: "AWS Introduction",
            description:
              "Understand the main services available on AWS.",
            duration: "24 min",
            videoId: "ulprqHHWlng"
          },
          {
            title: "Compute and Storage",
            description:
              "Explore cloud compute and storage fundamentals.",
            duration: "30 min",
            videoId: "Ia-UEYYR44s"
          },
          {
            title: "AWS Networking",
            description:
              "Understand basic cloud networking concepts.",
            duration: "28 min",
            videoId: "3hLmDS179YE"
          }
        ]
      },
      {
        id: "03",
        title: "Docker & Containers",
        lessons: [
          {
            title: "Container Fundamentals",
            description:
              "Understand containers and why they are used in modern development.",
            duration: "24 min",
            videoId: "fqMOX6JJhGo"
          },
          {
            title: "Docker Images",
            description:
              "Create and manage Docker images.",
            duration: "28 min",
            videoId: "pg19Z8LL06w"
          },
          {
            title: "Running Containers",
            description:
              "Run and manage applications using Docker containers.",
            duration: "30 min",
            videoId: "3c-iBn73dDE"
          }
        ]
      },
      {
        id: "04",
        title: "CI/CD",
        lessons: [
          {
            title: "CI/CD Fundamentals",
            description:
              "Understand continuous integration and continuous delivery.",
            duration: "23 min",
            videoId: "R8_veQiYBjI"
          },
          {
            title: "Deployment Pipelines",
            description:
              "Learn how automated deployment pipelines work.",
            duration: "31 min",
            videoId: "aXQ5f9F3w6U"
          }
        ]
      },
      {
        id: "05",
        title: "Cloud Project",
        lessons: [
          {
            title: "Project Architecture",
            description:
              "Plan a production-style cloud deployment architecture.",
            duration: "25 min",
            videoId: "M988_fsOSWo"
          },
          {
            title: "Application Deployment",
            description:
              "Apply cloud and DevOps concepts to a complete application.",
            duration: "38 min",
            videoId: "ulprqHHWlng"
          }
        ]
      }
    ]
  }
}

function Learning() {
  const params = new URLSearchParams(window.location.search)
  const courseId = params.get("course") || "mern"

  const [backendCourse, setBackendCourse] = useState(null)

  const course =
    learningCourses[courseId] ||
    backendCourse ||
    learningCourses.mern

  useEffect(() => {
    let cancelled = false

    async function loadCourse() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${encodeURIComponent(courseId)}`
        )

        if (!response.ok) {
          return
        }

        const data = await response.json()
        const backend = data?.course

        if (!backend || cancelled) {
          return
        }

        const modules = Array.isArray(backend.modules)
          ? backend.modules.map((module, moduleIndex) => ({
              id: String(moduleIndex + 1).padStart(2, "0"),
              title: module?.title || `Module ${moduleIndex + 1}`,
              lessons: (Array.isArray(module?.lessons)
                ? module.lessons
                : []
              ).map((lesson) => ({
                title: lesson?.title || "Lesson",
                description:
                  "Learn the concepts and practical skills covered in this lesson.",
                duration: "—",
                videoId: lesson?.videoId || ""
              }))
            }))
          : []

        setBackendCourse({
          ...learningCourses[courseId],
          ...backend,
          image:
            backend.image ||
            learningCourses[courseId]?.image ||
            learningCourses.mern.image,
          instructor:
            backend.instructor?.name ||
            backend.instructor ||
            learningCourses[courseId]?.instructor ||
            "LearnSphere Instructor",
          modules
        })
      } catch (error) {
        console.error(
          "Learning course loading error:",
          error
        )
      }
    }

    loadCourse()

    return () => {
      cancelled = true
    }
  }, [courseId])

  const allLessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title
    }))
  )

  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [currentPosition, setCurrentPosition] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(true)

  const playerRef = useRef(null)
  const saveTimerRef = useRef(null)
  const currentPositionRef = useRef(0)

  const lesson = allLessons[currentLesson]

  const completedCount = completedLessons.length

  const progress =
    allLessons.length > 0
      ? Math.round(
          (completedCount / allLessons.length) * 100
        )
      : 0

  const currentModule = course.modules.find(
    (module) => module.id === lesson?.moduleId
  )

  useEffect(() => {
    currentPositionRef.current = currentPosition
  }, [currentPosition])

  const getVideoPosition = useCallback(() => {
    if (
      playerRef.current &&
      typeof playerRef.current.getCurrentTime === "function"
    ) {
      try {
        const position =
          playerRef.current.getCurrentTime()

        if (Number.isFinite(position)) {
          return Math.floor(position)
        }
      } catch (error) {
        console.error(
          "Unable to read video position:",
          error
        )
      }
    }

    return currentPositionRef.current
  }, [])

  const saveProgress = useCallback(
    async (
      lessonIndex,
      position,
      completed
    ) => {
      const token =
        localStorage.getItem("learnsphereToken")

      if (!token) {
        return
      }

      try {
        await fetch(
          `http://localhost:5000/api/progress/${courseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              currentLesson: lessonIndex,
              currentPosition: Math.floor(
                Number(position) || 0
              ),
              completedLessons: completed
            })
          }
        )
      } catch (error) {
        console.error(
          "Progress save error:",
          error
        )
      }
    },
    [courseId]
  )

  const handleVideoComplete = useCallback(() => {
    setCompletedLessons((previous) => {
      const updatedCompleted =
        previous.includes(currentLesson)
          ? previous
          : [...previous, currentLesson]

      saveProgress(
        currentLesson,
        0,
        updatedCompleted
      )

      return updatedCompleted
    })

    setCurrentPosition(0)
    currentPositionRef.current = 0
  }, [currentLesson, saveProgress])

  useEffect(() => {
    const token =
      localStorage.getItem("learnsphereToken")

    if (!token) {
      window.location.assign("/login")
      return
    }

    fetch(
      `http://localhost:5000/api/progress/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load progress"
          )
        }

        return response.json()
      })
      .then((data) => {
        if (data.progress) {
          const savedLesson =
            Number(
              data.progress.currentLesson
            ) || 0

          const safeLesson =
            allLessons.length > 0
              ? Math.min(
                  Math.max(savedLesson, 0),
                  allLessons.length - 1
                )
              : 0

          setCurrentLesson(safeLesson)

          setCurrentPosition(
            Number(
              data.progress.currentPosition
            ) || 0
          )

          setCompletedLessons(
            Array.isArray(
              data.progress.completedLessons
            )
              ? data.progress.completedLessons.filter(
                  (item) =>
                    Number.isInteger(item) &&
                    item >= 0 &&
                    item < allLessons.length
                )
              : []
          )
        }

        setLoadingProgress(false)
      })
      .catch((error) => {
        console.error(
          "Progress loading error:",
          error
        )

        setLoadingProgress(false)
      })
  }, [courseId, allLessons.length])

  useEffect(() => {
    if (loadingProgress || !lesson?.videoId) {
      return
    }

    let player

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        return
      }

      player = new window.YT.Player("learnsphere-youtube-player", {
        videoId: lesson.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          vq: "hd1080"
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target

            if (currentPositionRef.current > 0) {
              event.target.seekTo(
                currentPositionRef.current,
                true
              )
            }
          },
          onStateChange: (event) => {
            if (
              event.data === window.YT.PlayerState.ENDED
            ) {
              handleVideoComplete()
            }
          }
        }
      })
    }

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer()
        return
      }

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )

      if (existingScript) {
        const checkAPI = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkAPI)
            createPlayer()
          }
        }, 100)

        return () => {
          clearInterval(checkAPI)
        }
      }

      const script = document.createElement("script")

      script.src =
        "https://www.youtube.com/iframe_api"

      script.async = true

      script.onload = () => {
        createPlayer()
      }

      document.body.appendChild(script)
    }

    const cleanupAPI = loadYouTubeAPI()

    return () => {
      if (typeof cleanupAPI === "function") {
        cleanupAPI()
      }

      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.error(
            "YouTube player cleanup error:",
            error
          )
        }

        playerRef.current = null
      }

      if (player) {
        try {
          player.destroy()
        } catch (error) {
          console.error(
            "YouTube player destroy error:",
            error
          )
        }
      }
    }
  }, [
    currentLesson,
    loadingProgress,
    lesson?.videoId,
    handleVideoComplete
  ])

  useEffect(() => {
    if (loadingProgress) {
      return
    }

    saveTimerRef.current =
      setInterval(() => {
        saveProgress(
          currentLesson,
          getVideoPosition(),
          completedLessons
        )
      }, 10000)

    return () => {
      if (saveTimerRef.current) {
        clearInterval(
          saveTimerRef.current
        )
      }
    }
  }, [
    currentLesson,
    completedLessons,
    loadingProgress,
    saveProgress,
    getVideoPosition
  ])

  useEffect(() => {
    const saveBeforeLeaving = () => {
      const token =
        localStorage.getItem(
          "learnsphereToken"
        )

      if (!token) {
        return
      }

      const position =
        getVideoPosition()

      fetch(
        `http://localhost:5000/api/progress/${courseId}`,
        {
          method: "PUT",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentLesson,
            currentPosition: Math.floor(
              Number(position) || 0
            ),
            completedLessons
          })
        }
      ).catch((error) => {
        console.error(
          "Before unload progress error:",
          error
        )
      })
    }

    window.addEventListener(
      "beforeunload",
      saveBeforeLeaving
    )

    return () => {
      window.removeEventListener(
        "beforeunload",
        saveBeforeLeaving
      )
    }
  }, [
    courseId,
    currentLesson,
    completedLessons,
    getVideoPosition
  ])

  function toggleComplete() {
    const updatedProgress =
      completedLessons.includes(
        currentLesson
      )
        ? completedLessons.filter(
            (item) =>
              item !== currentLesson
          )
        : [
            ...completedLessons,
            currentLesson
          ]

    setCompletedLessons(
      updatedProgress
    )

    saveProgress(
      currentLesson,
      getVideoPosition(),
      updatedProgress
    )
  }

  function changeLesson(index) {
    if (
      index < 0 ||
      index >= allLessons.length ||
      index === currentLesson
    ) {
      return
    }

    saveProgress(
      currentLesson,
      getVideoPosition(),
      completedLessons
    )

    setCurrentLesson(index)
    setCurrentPosition(0)
    currentPositionRef.current = 0

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  function goToPreviousLesson() {
    if (currentLesson > 0) {
      changeLesson(
        currentLesson - 1
      )
    }
  }

  function goToNextLesson() {
    if (
      currentLesson <
      allLessons.length - 1
    ) {
      changeLesson(
        currentLesson + 1
      )
    }
  }

  if (!lesson) {
    return null
  }

  return (
    <>
      <Navbar />

      <main className="learning-page">
        <section className="learning-header">
          <div className="learning-header-container">
            <div className="learning-course-info">
              <div className="learning-course-image">
                <img
                  src={course.image}
                  alt={course.title}
                />
              </div>

              <div>
                <span>
                  {course.category}
                </span>

                <h1>
                  {course.title}
                </h1>

                <p>
                  Instructor:{" "}
                  {course.instructor}
                </p>
              </div>
            </div>

            <div className="learning-progress-box">
              <div className="learning-progress-top">
                <span>
                  Course Progress
                </span>

                <strong>
                  {progress}%
                </strong>
              </div>

              <div className="learning-progress-bar">
                <span
                  style={{
                    width: `${progress}%`
                  }}
                ></span>
              </div>

              <small>
                {completedCount} of{" "}
                {allLessons.length} lessons
                completed
              </small>
            </div>
          </div>
        </section>

        <section className="learning-workspace">
          <aside className="learning-sidebar">
            <div className="learning-sidebar-heading">
              <div>
                <span>
                  COURSE CONTENT
                </span>

                <h2>
                  Learning Path
                </h2>
              </div>

              <strong>
                {progress}%
              </strong>
            </div>

            <div className="learning-sidebar-progress">
              <span
                style={{
                  width: `${progress}%`
                }}
              ></span>
            </div>

            <div className="learning-modules">
              {course.modules.map(
                (module) => (
                  <div
                    className="learning-module"
                    key={module.id}
                  >
                    <div className="learning-module-title">
                      <span>
                        {module.id}
                      </span>

                      <strong>
                        {module.title}
                      </strong>
                    </div>

                    <div className="learning-lessons">
                      {module.lessons.map(
                        (moduleLesson) => {
                          const lessonIndex =
                            allLessons.findIndex(
                              (item) =>
                                item.title ===
                                  moduleLesson.title &&
                                item.moduleId ===
                                  module.id
                            )

                          const isActive =
                            lessonIndex ===
                            currentLesson

                          const isComplete =
                            completedLessons.includes(
                              lessonIndex
                            )

                          return (
                            <button
                              type="button"
                              className={`learning-lesson ${
                                isActive
                                  ? "active"
                                  : ""
                              } ${
                                isComplete
                                  ? "completed"
                                  : ""
                              }`}
                              key={`${module.id}-${moduleLesson.title}`}
                              onClick={() =>
                                changeLesson(
                                  lessonIndex
                                )
                              }
                            >
                              <span className="lesson-status">
                                {isComplete
                                  ? "✓"
                                  : String(
                                      lessonIndex +
                                        1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                              </span>

                              <span className="lesson-name">
                                {
                                  moduleLesson.title
                                }
                              </span>

                              <span className="lesson-duration">
                                {
                                  moduleLesson.duration
                                }
                              </span>
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </aside>

          <div className="learning-content">
            <div className="learning-breadcrumb">
              <span>
                {currentModule?.title}
              </span>

              <span>
                /
              </span>

              <strong>
                Lesson{" "}
                {currentLesson + 1}
              </strong>
            </div>

            <div className="learning-video">
              {lesson.videoId ? (
                <div
                  id="learnsphere-youtube-player"
                  className="learning-youtube-player"
                ></div>
              ) : (
                <div className="learning-video-content">
                  <div className="learning-play-button">
                    ▶
                  </div>

                  <span>
                    LEARNSPHERE LESSON
                  </span>

                  <h2>
                    {lesson.title}
                  </h2>

                  <p>
                    Video will be available soon
                  </p>
                </div>
              )}
            </div>

            <div className="learning-lesson-content">
              <div className="learning-lesson-heading">
                <div>
                  <span className="section-label">
                    LESSON{" "}
                    {String(
                      currentLesson + 1
                    ).padStart(2, "0")}
                  </span>

                  <h2>
                    {lesson.title}
                  </h2>
                </div>

                <span className="lesson-module-label">
                  {currentModule?.title}
                </span>
              </div>

              <p className="learning-description">
                {lesson.description}
              </p>

              <div className="learning-objectives">
                <div>
                  <span>
                    01
                  </span>

                  <div>
                    <strong>
                      Understand the concept
                    </strong>

                    <p>
                      Build a clear understanding
                      of the main lesson topic.
                    </p>
                  </div>
                </div>

                <div>
                  <span>
                    02
                  </span>

                  <div>
                    <strong>
                      Apply what you learn
                    </strong>

                    <p>
                      Practice the concept with
                      practical development examples.
                    </p>
                  </div>
                </div>

                <div>
                  <span>
                    03
                  </span>

                  <div>
                    <strong>
                      Continue your learning
                    </strong>

                    <p>
                      Complete the lesson and move
                      to the next topic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="learning-actions">
                <button
                  type="button"
                  className={
                    completedLessons.includes(
                      currentLesson
                    )
                      ? "completed-btn"
                      : "complete-btn"
                  }
                  onClick={
                    toggleComplete
                  }
                >
                  {completedLessons.includes(
                    currentLesson
                  )
                    ? "✓ Lesson Completed"
                    : "Mark as Complete"}
                </button>
              </div>
            </div>

            <div className="learning-navigation">
              <button
                type="button"
                className="learning-nav-btn"
                onClick={
                  goToPreviousLesson
                }
                disabled={
                  currentLesson === 0
                }
              >
                <span>
                  ←
                </span>

                <div>
                  <small>
                    PREVIOUS
                  </small>

                  <strong>
                    {currentLesson > 0
                      ? allLessons[
                          currentLesson - 1
                        ].title
                      : "First lesson"}
                  </strong>
                </div>
              </button>

              <button
                type="button"
                className="learning-nav-btn next"
                onClick={
                  goToNextLesson
                }
                disabled={
                  currentLesson ===
                  allLessons.length - 1
                }
              >
                <div>
                  <small>
                    NEXT LESSON
                  </small>

                  <strong>
                    {currentLesson <
                    allLessons.length - 1
                      ? allLessons[
                          currentLesson + 1
                        ].title
                      : "Course completed"}
                  </strong>
                </div>

                <span>
                  →
                </span>
              </button>
            </div>

            {progress === 100 && (
              <div className="learning-complete-banner">
                <div className="learning-complete-icon">
                  ✓
                </div>

                <div>
                  <span>
                    COURSE COMPLETED
                  </span>

                  <h2>
                    Congratulations!
                  </h2>

                  <p>
                    You have completed all lessons
                    in this course. Your assessment
                    is ready for the next step.
                  </p>

                  <button
                    type="button"
                    className="learning-quiz-btn"
                    onClick={() => {
                      window.location.assign(
                        `/quiz?course=${courseId}`
                      )
                    }}
                  >
                    Take Final Quiz →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Learning