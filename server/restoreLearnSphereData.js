const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

const User = require("./models/User")
const Course = require("./models/Course")

dotenv.config()

const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL

if (!mongoUri) {
  throw new Error(
    "MongoDB connection string is missing. Use MONGO_URI, MONGODB_URI or MONGODB_URL in .env."
  )
}

const instructors = [
  {
    name: "Arjun Sharma",
    email: "arjun@learnsphere.com",
    role: "MERN Stack Developer",
    category: "Web Development",
    experience: "8+ Years",
    photo: "https://c.superprof.com/i/a/22599685/10692784/600/20220924155851/senior-software-engineer-jahre-berufserfahrung-gibt-individuelles-mentoring-laravel-webentwicklung-erwachsene.jpg",
    bio: "Full-stack developer and instructor focused on modern JavaScript, React, Node.js and scalable web applications.",
    expertise: ["React", "Node.js", "MongoDB"]
  },
  {
    name: "Ananya Rao",
    email: "ananya@learnsphere.com",
    role: "Frontend Specialist",
    category: "Web Development",
    experience: "7+ Years",
    photo: "https://www.cs.princeton.edu/courses/archive/spring24/cos432/images/maria-photo.jpg",
    bio: "Frontend specialist helping learners build responsive, accessible and high-quality interfaces with modern technologies.",
    expertise: ["React", "JavaScript", "CSS"]
  },
  {
    name: "Rahul Mehta",
    email: "rahul@learnsphere.com",
    role: "Data Scientist",
    category: "Data Science",
    experience: "9+ Years",
    photo: "https://files.gotocon.com/uploads/portraits/799/square_medium/michele_angioni_1569346018.jpg",
    bio: "Data scientist and educator specializing in Python, machine learning, data analysis and practical AI solutions.",
    expertise: ["Python", "Pandas", "Machine Learning"]
  },
  {
    name: "Priya Nair",
    email: "priya@learnsphere.com",
    role: "Product Designer",
    category: "UI / UX Design",
    experience: "6+ Years",
    photo: "https://profile-images.xing.com/images/dbc28e9e1ba1f7918dc3954850c6f727-1/birva-mandalia.1024x1024.jpg",
    bio: "Product designer passionate about user research, design systems and creating meaningful digital experiences.",
    expertise: ["Figma", "UX Research", "Prototyping"]
  },
  {
    name: "Vikram Singh",
    email: "vikram@learnsphere.com",
    role: "AI Engineer",
    category: "Artificial Intelligence",
    experience: "8+ Years",
    photo: "https://cdn.mentorcruise.com/cdn-cgi/image/width%3D504%2Cformat%3Dauto/https%3A/cdn.mentorcruise.com/cache/9890350416cd83e8743d7c3e28439389/7e7e80c4c1b31715/54fe82b7e007d6a192725100ebfcb9d2.jpg",
    bio: "AI engineer focused on machine learning fundamentals, intelligent systems and practical applications of AI.",
    expertise: ["AI", "Python", "Machine Learning"]
  },
  {
    name: "Karan Verma",
    email: "karan@learnsphere.com",
    role: "Cloud & DevOps Engineer",
    category: "Cloud & DevOps",
    experience: "10+ Years",
    photo: "https://profile-images.xing.com/images/b753d7ebb1ea6716ba6623158d8eb171-2/ooi-siang-tan.1024x1024.jpg",
    bio: "Cloud and DevOps professional teaching scalable infrastructure, deployment workflows and modern cloud technologies.",
    expertise: ["AWS", "Docker", "DevOps"]
  }
]

const courses = [
  {
    courseId: "mern",
    title: "MERN Stack Development",
    category: "Web Development",
    instructorName: "Arjun Sharma",
    price: 2499,
    duration: "42+ hours",
    image: "https://cdn.simpleicons.org/react/61DAFB",
    description: "Learn full-stack web development with React, Node.js, Express and MongoDB through practical projects.",
    lessonCount: 19
  },
  {
    courseId: "frontend",
    title: "Frontend Development with React",
    category: "Web Development",
    instructorName: "Ananya Rao",
    price: 1999,
    duration: "36+ hours",
    image: "https://cdn.simpleicons.org/react/61DAFB",
    description: "Build responsive and modern web interfaces with React, JavaScript, CSS and real-world frontend projects.",
    lessonCount: 17
  },
  {
    courseId: "datascience",
    title: "Data Science with Python",
    category: "Data Science",
    instructorName: "Rahul Mehta",
    price: 2799,
    duration: "48+ hours",
    image: "https://cdn.simpleicons.org/python/3776AB",
    description: "Learn Python data analysis, visualization and practical machine learning workflows using real-world datasets.",
    lessonCount: 15
  },
  {
    courseId: "uiux",
    title: "UI/UX Design Masterclass",
    category: "UI / UX Design",
    instructorName: "Priya Nair",
    price: 1999,
    duration: "32+ hours",
    image: "https://cdn.simpleicons.org/figma/F24E1E",
    description: "Learn UX research, wireframing, interface design, design systems and prototyping with practical projects.",
    lessonCount: 13
  },
  {
    courseId: "ai",
    title: "Artificial Intelligence Fundamentals",
    category: "Artificial Intelligence",
    instructorName: "Vikram Singh",
    price: 2299,
    duration: "40+ hours",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    description: "Understand AI and machine learning fundamentals and apply them to practical intelligent systems.",
    lessonCount: 13
  },
  {
    courseId: "cloud",
    title: "Cloud & DevOps Engineering",
    category: "Cloud & DevOps",
    instructorName: "Karan Verma",
    price: 2699,
    duration: "44+ hours",
    image: "https://cdn.simpleicons.org/amazonaws/FF9900",
    description: "Learn cloud infrastructure, AWS, Docker, CI/CD and deployment workflows through practical DevOps projects.",
    lessonCount: 13
  }
]

const videoIds = [
  "dQw4w9WgXcQ",
  "shuIfhrLIP0",
  "5ZG_1WJEgu4",
  "9BdtGjoIN4E",
  "FTFaQWZBqQ8"
]

const relatedCourseModules = {
  mern: [
    {
      title: "JavaScript Foundations",
      lessons: [
        { title: "JavaScript Basics and Variables", videoId: "PkZNo7MFNFg" },
        { title: "Functions and Reusable Code", videoId: "PkZNo7MFNFg" },
        { title: "Arrays and Objects", videoId: "PkZNo7MFNFg" },
        { title: "Modern ES6 Features", videoId: "PkZNo7MFNFg" }
      ]
    },
    {
      title: "React Fundamentals",
      lessons: [
        { title: "React and JSX", videoId: "bMknfKXIFA8" },
        { title: "React Components", videoId: "bMknfKXIFA8" },
        { title: "Props and Component Data", videoId: "bMknfKXIFA8" },
        { title: "State and React Hooks", videoId: "bMknfKXIFA8" }
      ]
    },
    {
      title: "Node.js and Express",
      lessons: [
        { title: "Node.js Backend Fundamentals", videoId: "qwfE7fSVaZM" },
        { title: "Building APIs with Express", videoId: "qwfE7fSVaZM" },
        { title: "REST API Project Structure", videoId: "qwfE7fSVaZM" },
        { title: "JWT Authentication Basics", videoId: "qwfE7fSVaZM" }
      ]
    },
    {
      title: "MongoDB and CRUD",
      lessons: [
        { title: "MongoDB Fundamentals", videoId: "_7UQPve99r4" },
        { title: "MongoDB with Node.js", videoId: "_7UQPve99r4" },
        { title: "CRUD API Operations", videoId: "_7UQPve99r4" },
        { title: "Connecting the Database to Express", videoId: "_7UQPve99r4" }
      ]
    },
    {
      title: "MERN Full Stack Project",
      lessons: [
        { title: "MERN Stack Architecture", videoId: "7CqJlxBYj-M" },
        { title: "React Frontend with an API", videoId: "7CqJlxBYj-M" },
        { title: "MERN Application Data Flow", videoId: "7CqJlxBYj-M" }
      ]
    }
  ],
  frontend: [
    {
      title: "HTML Foundations",
      lessons: [
        { title: "HTML Document Structure", videoId: "pQN-pnXPaVg" },
        { title: "HTML Elements and Text", videoId: "pQN-pnXPaVg" },
        { title: "Links, Images and Media", videoId: "pQN-pnXPaVg" },
        { title: "HTML Forms and Inputs", videoId: "pQN-pnXPaVg" }
      ]
    },
    {
      title: "CSS and Flexbox",
      lessons: [
        { title: "CSS Fundamentals", videoId: "nbsz6muQRT4" },
        { title: "Flexbox Direction and Wrapping", videoId: "nbsz6muQRT4" },
        { title: "Aligning Flex Items", videoId: "nbsz6muQRT4" },
        { title: "Building Responsive Layouts", videoId: "nbsz6muQRT4" }
      ]
    },
    {
      title: "JavaScript for Frontend",
      lessons: [
        { title: "JavaScript Variables and Types", videoId: "PkZNo7MFNFg" },
        { title: "Functions and Arrays", videoId: "PkZNo7MFNFg" },
        { title: "Objects and Loops", videoId: "PkZNo7MFNFg" },
        { title: "Modern JavaScript and ES6", videoId: "PkZNo7MFNFg" }
      ]
    },
    {
      title: "React Development",
      lessons: [
        { title: "React and JSX", videoId: "bMknfKXIFA8" },
        { title: "Components and Props", videoId: "bMknfKXIFA8" },
        { title: "State and Events", videoId: "bMknfKXIFA8" },
        { title: "Forms and Controlled Inputs", videoId: "bMknfKXIFA8" },
        { title: "useEffect and API Calls", videoId: "bMknfKXIFA8" }
      ]
    }
  ],
  datascience: [
    {
      title: "Python for Data Science",
      lessons: [
        { title: "Python Setup and Basics", videoId: "CMEWVn1uZpQ" },
        { title: "Python Variables and Data Types", videoId: "CMEWVn1uZpQ" },
        { title: "Python Functions and Control Flow", videoId: "CMEWVn1uZpQ" },
        { title: "Python for Data Analysis", videoId: "CMEWVn1uZpQ" }
      ]
    },
    {
      title: "NumPy and Pandas",
      lessons: [
        { title: "NumPy Arrays", videoId: "r-uOLxNrNk8" },
        { title: "Pandas DataFrames", videoId: "r-uOLxNrNk8" },
        { title: "Filtering and Selecting Data", videoId: "CMEWVn1uZpQ" },
        { title: "Reshaping and Pivoting Data", videoId: "CMEWVn1uZpQ" }
      ]
    },
    {
      title: "Data Cleaning and Visualization",
      lessons: [
        { title: "Data Cleaning with Pandas", videoId: "r-uOLxNrNk8" },
        { title: "Reading Data from Sources", videoId: "r-uOLxNrNk8" },
        { title: "Matplotlib and Data Visualization", videoId: "r-uOLxNrNk8" },
        { title: "Seaborn and Reporting", videoId: "r-uOLxNrNk8" }
      ]
    },
    {
      title: "Machine Learning with Python",
      lessons: [
        { title: "Linear Regression and Gradient Descent", videoId: "hDKCxebp88A" },
        { title: "Classification with Logistic Regression", videoId: "hDKCxebp88A" },
        { title: "Decision Trees and Random Forests", videoId: "hDKCxebp88A" }
      ]
    }
  ],
  uiux: [
    {
      title: "UX Research",
      lessons: [
        { title: "Introduction to User Research", videoId: "A5gc9A6Zj3w" },
        { title: "Qualitative and Quantitative Research", videoId: "A5gc9A6Zj3w" },
        { title: "Interviews, Surveys and Usability Testing", videoId: "A5gc9A6Zj3w" }
      ]
    },
    {
      title: "Figma UI Foundations",
      lessons: [
        { title: "Creating a Figma Design File", videoId: "jwCmIBJ8Jtc" },
        { title: "Shapes, Selection and Editing", videoId: "jwCmIBJ8Jtc" },
        { title: "Typography, Color and Spacing", videoId: "jwCmIBJ8Jtc" },
        { title: "Components and Auto Layout", videoId: "jwCmIBJ8Jtc" }
      ]
    },
    {
      title: "Design Systems and Responsive UI",
      lessons: [
        { title: "Design Styles and Components", videoId: "jwCmIBJ8Jtc" },
        { title: "Constraints and Responsive Design", videoId: "jwCmIBJ8Jtc" },
        { title: "Layout Grids and Responsive Patterns", videoId: "jwCmIBJ8Jtc" }
      ]
    },
    {
      title: "Prototyping and Mobile Design",
      lessons: [
        { title: "Website Design in Figma", videoId: "jwCmIBJ8Jtc" },
        { title: "Mobile App Design", videoId: "jwCmIBJ8Jtc" },
        { title: "Prototyping and Animation", videoId: "jwCmIBJ8Jtc" }
      ]
    }
  ],
  ai: [
    {
      title: "AI Fundamentals",
      lessons: [
        { title: "What Is Artificial Intelligence", videoId: "jRTRjORaKQU" },
        { title: "AI Concepts and Applications", videoId: "jRTRjORaKQU" },
        { title: "AI Problem Solving with Python", videoId: "jRTRjORaKQU" }
      ]
    },
    {
      title: "Machine Learning",
      lessons: [
        { title: "Machine Learning Fundamentals", videoId: "hDKCxebp88A" },
        { title: "Linear and Logistic Regression", videoId: "hDKCxebp88A" },
        { title: "Decision Trees and Random Forests", videoId: "hDKCxebp88A" },
        { title: "Unsupervised Learning", videoId: "hDKCxebp88A" }
      ]
    },
    {
      title: "Neural Networks",
      lessons: [
        { title: "Neural Network Fundamentals", videoId: "jRTRjORaKQU" },
        { title: "Neural Network Training", videoId: "jRTRjORaKQU" },
        { title: "Neural Network Demonstration", videoId: "jRTRjORaKQU" }
      ]
    },
    {
      title: "Computer Vision and Deep Learning",
      lessons: [
        { title: "Image Processing Fundamentals", videoId: "jRTRjORaKQU" },
        { title: "Convolutional Neural Networks", videoId: "jRTRjORaKQU" },
        { title: "Practical AI Applications", videoId: "jRTRjORaKQU" }
      ]
    }
  ],
  cloud: [
    {
      title: "AWS Cloud Fundamentals",
      lessons: [
        { title: "Cloud Concepts and Benefits", videoId: "7HKot-brXFE" },
        { title: "AWS Global Infrastructure", videoId: "7HKot-brXFE" },
        { title: "Cloud Architecture", videoId: "7HKot-brXFE" },
        { title: "AWS Compute and Storage", videoId: "7HKot-brXFE" }
      ]
    },
    {
      title: "Docker and Containers",
      lessons: [
        { title: "Why Containers and Docker", videoId: "rjjES5IsPdg" },
        { title: "Docker Architecture and Commands", videoId: "rjjES5IsPdg" },
        { title: "Docker Networking and Volumes", videoId: "rjjES5IsPdg" },
        { title: "Docker Compose", videoId: "rjjES5IsPdg" }
      ]
    },
    {
      title: "CI/CD and Deployment",
      lessons: [
        { title: "Dockerfiles and Image Layers", videoId: "rjjES5IsPdg" },
        { title: "Containerizing a Web Application", videoId: "rjjES5IsPdg" },
        { title: "Deployment on AWS", videoId: "rjjES5IsPdg" }
      ]
    },
    {
      title: "Cloud Security and Operations",
      lessons: [
        { title: "AWS Shared Responsibility and Security", videoId: "7HKot-brXFE" },
        { title: "Logging, Monitoring and Governance", videoId: "7HKot-brXFE" }
      ]
    }
  ]
}

function makeModules(title, lessonCount) {
  const moduleCounts = [
    Math.ceil(lessonCount / 5),
    Math.ceil(lessonCount / 5),
    Math.ceil(lessonCount / 5),
    Math.ceil(lessonCount / 5),
    Math.max(
      0,
      lessonCount - Math.ceil(lessonCount / 5) * 4
    )
  ]

  let lessonNumber = 0

  return moduleCounts
    .map((count, moduleIndex) => {
      const lessons = []

      for (let index = 0; index < count; index += 1) {
        lessonNumber += 1
        lessons.push({
          title: `${title} - Lesson ${lessonNumber}`,
          videoId: videoIds[(lessonNumber - 1) % videoIds.length]
        })
      }

      return {
        title: `Module ${moduleIndex + 1}`,
        lessons
      }
    })
    .filter((module) => module.lessons.length > 0)
}

function makeRelatedModules(courseId) {
  const moduleData =
    relatedCourseModules[courseId]

  if (!Array.isArray(moduleData)) {
    return []
  }

  return moduleData.map((module) => ({
    title: module.title,
    lessons: module.lessons.map((lesson) => ({
      title: lesson.title,
      videoId: lesson.videoId
    }))
  }))
}

function isGeneratedSeedModules(course, modules) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return true
  }

  const firstModule =
    modules[0]

  const firstLesson =
    Array.isArray(firstModule?.lessons)
      ? firstModule.lessons[0]
      : null

  return (
    firstModule?.title === "Module 1" &&
    typeof firstLesson?.title === "string" &&
    firstLesson.title.startsWith(
      `${course.title} - Lesson`
    )
  )
}

async function restoreData() {
  try {
    await mongoose.connect(mongoUri)

    const passwordHash = await bcrypt.hash(
      "name123",
      10
    )

    const instructorMap = {}

    for (const instructor of instructors) {
      let user = await User.findOne({
        $or: [
          { email: instructor.email },
          { name: instructor.name, role: "instructor" }
        ]
      })

      if (!user) {
        user = new User({
          name: instructor.name,
          email: instructor.email,
          password: passwordHash,
          role: "instructor"
        })
      } else {
        user.name = instructor.name
        user.password = passwordHash
        user.role = "instructor"
      }

      user.photo = instructor.photo
      user.bio = instructor.bio
      user.expertise = Array.isArray(instructor.expertise)
        ? instructor.expertise.join(", ")
        : instructor.expertise
      user.experience = instructor.experience
      user.disabled = false

      await user.save()

      instructorMap[instructor.name] = user._id
    }

    for (const courseData of courses) {
      const instructorId = instructorMap[courseData.instructorName]

      let course = await Course.findOne({
        courseId: courseData.courseId
      })

      if (!course) {
        course = new Course({
          courseId: courseData.courseId,
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          instructor: instructorId,
          price: courseData.price,
          duration: courseData.duration,
          image: courseData.image,
          modules: makeModules(
            courseData.title,
            courseData.lessonCount
          )
        })
      } else {
        course.title = courseData.title
        course.description = courseData.description
        course.category = courseData.category
        course.instructor = instructorId
        course.price = courseData.price
        course.duration = courseData.duration
        course.image = courseData.image

        if (!Array.isArray(course.modules) || course.modules.length === 0) {
          course.modules = makeModules(
            courseData.title,
            courseData.lessonCount
          )
        }
      }

      if (
        Array.isArray(
          relatedCourseModules[
            courseData.courseId
          ]
        ) &&
        isGeneratedSeedModules(
          course,
          course.modules
        )
      ) {
        course.modules =
          makeRelatedModules(
            courseData.courseId
          )
      }

      await course.save()
    }

    console.log("LearnSphere previous instructors and courses restored.")
    console.log("Previous instructor password: name123")
    console.log("Existing matching instructor emails were preserved.")
  } finally {
    await mongoose.disconnect()
  }
}

restoreData().catch((error) => {
  console.error("Restore data error:", error)
  process.exitCode = 1
})
