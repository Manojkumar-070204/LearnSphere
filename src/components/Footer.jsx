function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>
            Learn<span>Sphere</span>
          </h2>

          <p>
            Learn new skills, grow your knowledge,
            and build a better future.
          </p>
        </div>

        <div className="footer-links">
          <h3>Platform</h3>
          <a href="/courses">Courses</a>
          <a href="/instructors">Instructors</a>
          <a href="/certificates">Certificates</a>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className="footer-links">
          <h3>Support</h3>
          <a href="#">Help Center</a>
          <a href="#">FAQ</a>
          <a href="#">Terms</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 LearnSphere. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer