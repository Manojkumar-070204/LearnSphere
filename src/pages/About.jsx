import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function About() {
  const values = [
    {
      number: "01",
      title: "Practical Learning",
      text: "Learn through real projects, practical exercises, and industry-focused lessons."
    },
    {
      number: "02",
      title: "Expert Guidance",
      text: "Learn from experienced professionals who bring real-world knowledge into every course."
    },
    {
      number: "03",
      title: "Career Focused",
      text: "Build the technical skills and confidence needed to move forward in your career."
    },
    {
      number: "04",
      title: "Continuous Growth",
      text: "Keep learning with structured courses and updated technology-focused content."
    }
  ]

  const process = [
    {
      step: "01",
      title: "Choose Your Course",
      text: "Explore courses based on your interests, career goals, and current skill level."
    },
    {
      step: "02",
      title: "Learn at Your Pace",
      text: "Follow structured lessons and learn whenever it fits your schedule."
    },
    {
      step: "03",
      title: "Practice & Build",
      text: "Apply your knowledge through practical lessons, projects, and assessments."
    },
    {
      step: "04",
      title: "Grow Your Career",
      text: "Use your new skills to build projects, strengthen your profile, and pursue opportunities."
    }
  ]

  return (
    <div className="about-page">

      <Navbar />

      <main>

        <section className="about-hero">
          <div className="about-hero-grid"></div>

          <div className="about-hero-content">
            <span className="about-eyebrow">
              ABOUT LEARNSPHERE
            </span>

            <h1>
              Learning that moves
              <span> your career forward.</span>
            </h1>

            <p>
              LearnSphere is a modern learning platform designed to help
              students and professionals build practical skills, learn from
              industry experts, and prepare for the future.
            </p>

            <div className="about-hero-actions">
              <button
                type="button"
                className="about-primary-btn"
                onClick={() => window.location.assign("/courses")}
              >
                Explore Courses
              </button>

              <button
                type="button"
                className="about-secondary-btn"
                onClick={() => window.location.assign("/instructors")}
              >
                Meet Our Instructors
              </button>
            </div>
          </div>

          <div className="about-hero-visual">
            <div className="about-visual-card main">
              <div className="visual-icon">LS</div>

              <div>
                <strong>LearnSphere</strong>
                <span>Learning without limits</span>
              </div>
            </div>

            <div className="about-floating-card students">
              <strong>50K+</strong>
              <span>Learners</span>
            </div>

            <div className="about-floating-card courses">
              <strong>120+</strong>
              <span>Courses</span>
            </div>

            <div className="about-orbit orbit-one"></div>
            <div className="about-orbit orbit-two"></div>
          </div>
        </section>

        <section className="about-intro">
          <div className="about-section-label">
            <span>OUR STORY</span>
          </div>

          <div className="about-intro-content">
            <div className="about-intro-heading">
              <h2>
                Education should be
                <span> accessible, practical, and meaningful.</span>
              </h2>
            </div>

            <div className="about-intro-text">
              <p>
                LearnSphere was created with a simple idea: learning should
                help people make real progress. Instead of focusing only on
                theory, our platform combines structured education with
                practical skills and project-based learning.
              </p>

              <p>
                From web development and data science to artificial
                intelligence, design, and cloud technologies, LearnSphere
                brings modern learning experiences into one platform.
              </p>
            </div>
          </div>
        </section>

        <section className="about-stats">
          <div className="about-stat">
            <strong>50K+</strong>
            <span>Active Learners</span>
          </div>

          <div className="about-stat">
            <strong>120+</strong>
            <span>Professional Courses</span>
          </div>

          <div className="about-stat">
            <strong>40+</strong>
            <span>Industry Instructors</span>
          </div>

          <div className="about-stat">
            <strong>95%</strong>
            <span>Learner Satisfaction</span>
          </div>
        </section>

        <section className="about-mission">
          <div className="about-mission-visual">
            <div className="mission-panel">
              <span className="mission-small-label">
                OUR MISSION
              </span>

              <div className="mission-line"></div>

              <h3>
                Make quality learning
                <span> easier to access.</span>
              </h3>

              <p>
                We want learners to have the knowledge, resources, and
                confidence required to turn learning into meaningful progress.
              </p>
            </div>
          </div>

          <div className="about-mission-content">
            <span className="about-eyebrow">
              MISSION & VISION
            </span>

            <h2>
              Building a smarter
              <span> way to learn.</span>
            </h2>

            <p>
              Our mission is to create an environment where anyone can learn
              valuable skills through clear lessons, expert instruction, and
              practical experiences.
            </p>

            <p>
              Our vision is to build a learning ecosystem where education,
              technology, and career development come together.
            </p>

            <div className="mission-points">
              <div>
                <span>✓</span>
                <p>Industry-relevant curriculum</p>
              </div>

              <div>
                <span>✓</span>
                <p>Project-based learning</p>
              </div>

              <div>
                <span>✓</span>
                <p>Expert-led education</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="about-section-heading">
            <span className="about-eyebrow">
              WHAT WE BELIEVE
            </span>

            <h2>
              Built around the
              <span> learner.</span>
            </h2>

            <p>
              Everything we create is designed to make learning clearer,
              more practical, and more valuable.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((value) => (
              <article
                className="about-value-card"
                key={value.number}
              >
                <span className="value-number">
                  {value.number}
                </span>

                <h3>{value.title}</h3>

                <p>{value.text}</p>

                <span className="value-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-process">
          <div className="about-section-heading">
            <span className="about-eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              From learning to
              <span> real-world skills.</span>
            </h2>
          </div>

          <div className="about-process-grid">
            {process.map((item) => (
              <article
                className="about-process-card"
                key={item.step}
              >
                <span className="process-number">
                  {item.step}
                </span>

                <div className="process-connector"></div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-technology">
          <div className="technology-content">
            <span className="about-eyebrow">
              LEARN MODERN TECHNOLOGY
            </span>

            <h2>
              Skills that stay
              <span> relevant.</span>
            </h2>

            <p>
              LearnSphere focuses on technologies and professional skills that
              help learners adapt to a rapidly changing digital world.
            </p>

            <div className="technology-tags">
              <span>React</span>
              <span>Node.js</span>
              <span>Python</span>
              <span>AI</span>
              <span>Cloud</span>
              <span>UI / UX</span>
            </div>
          </div>

          <div className="technology-visual">
            <div className="tech-core">
              <span>LS</span>
            </div>

            <div className="tech-ring ring-one"></div>
            <div className="tech-ring ring-two"></div>
            <div className="tech-ring ring-three"></div>

            <span className="tech-node node-one">JS</span>
            <span className="tech-node node-two">AI</span>
            <span className="tech-node node-three">PY</span>
            <span className="tech-node node-four">UX</span>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-cta-content">
            <span className="about-eyebrow">
              START YOUR JOURNEY
            </span>

            <h2>
              Your next skill
              <span> starts here.</span>
            </h2>

            <p>
              Explore LearnSphere courses and start building skills that can
              shape your next opportunity.
            </p>

            <button
              type="button"
              className="about-primary-btn"
              onClick={() => window.location.assign("/courses")}
            >
              Explore Courses →
            </button>
          </div>
        </section>

      </main>

      <Footer />

    </div>
  )
}

export default About