import { useState } from "react" 
import Navbar from "../components/Navbar" 
import Footer from "../components/Footer" 
 
function Contact() { 
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    subject: "", 
    message: "" 
  }) 
 
  const [submitted, setSubmitted] = useState(false) 
 
  function handleChange(event) { 
    const { name, value } = event.target 
 
    setFormData({ 
      ...formData, 
      [name]: value 
    }) 
 
    setSubmitted(false) 
  } 
 
  function handleSubmit(event) { 
    event.preventDefault() 
 
    if ( 
      !formData.name.trim() || 
      !formData.email.trim() || 
      !formData.subject.trim() || 
      !formData.message.trim() 
    ) { 
      return 
    } 
 
    setSubmitted(true) 
 
    setFormData({ 
      name: "", 
      email: "", 
      subject: "", 
      message: "" 
    }) 
  } 
 
  return ( 
    <div className="contact-page"> 
 
      <Navbar /> 
 
      <main> 
 
        <section className="contact-hero"> 
          <div className="contact-hero-grid"></div> 
 
          <div className="contact-hero-content"> 
            <span className="contact-eyebrow"> 
              CONTACT LEARNSPHERE 
            </span> 
 
            <h1> 
              Let's start a 
              <span> conversation.</span> 
            </h1> 
 
            <p> 
              Have a question about our courses, learning platform, or 
              instructors? Our team is here to help. 
            </p> 
          </div> 
 
          <div className="contact-hero-status"> 
            <span className="status-dot"></span> 
            <span>Support team available</span> 
          </div> 
        </section> 
 
        <section className="contact-main"> 
 
          <div className="contact-info"> 
 
            <div className="contact-section-heading"> 
              <span className="contact-eyebrow"> 
                GET IN TOUCH 
              </span> 
 
              <h2> 
                We're here to 
                <span> help.</span> 
              </h2> 
 
              <p> 
                Reach out to LearnSphere for questions about courses, 
                enrollment, certificates, or general support. 
              </p> 
            </div> 
 
            <div className="contact-info-list"> 
 
              <div className="contact-info-card"> 
                <div className="contact-info-icon"> 
                  @ 
                </div> 
 
                <div> 
                  <span>Email</span> 
                  <strong>support@learnsphere.com</strong> 
                  <p>We'll respond as soon as possible.</p> 
                </div> 
              </div> 
 
              <div className="contact-info-card"> 
                <div className="contact-info-icon"> 
                  ? 
                </div> 
 
                <div> 
                  <span>Help Center</span> 
                  <strong>Learning Support</strong> 
                  <p>Get assistance with your learning journey.</p> 
                </div> 
              </div> 
 
              <div className="contact-info-card"> 
                <div className="contact-info-icon"> 
                  LS 
                </div> 
 
                <div> 
                  <span>LearnSphere</span> 
                  <strong>Online Learning Platform</strong> 
                  <p>Learn from anywhere, at your own pace.</p> 
                </div> 
              </div> 
 
            </div> 
 
            <div className="contact-social"> 
              <span>Follow LearnSphere</span> 
 
              <div className="contact-social-links"> 
                <a href="#" aria-label="LinkedIn">in</a> 
                <a href="#" aria-label="GitHub">GH</a> 
                <a href="#" aria-label="Instagram">IG</a> 
                <a href="#" aria-label="YouTube">YT</a> 
              </div> 
            </div> 
 
          </div> 
 
          <div className="contact-form-wrapper"> 
 
            <div className="contact-form-header"> 
              <span>MESSAGE US</span> 
              <p> 
                Fill in the details below and our team will get back to you. 
              </p> 
            </div> 
 
            <form 
              className="contact-form" 
              onSubmit={handleSubmit} 
            > 
 
              <div className="contact-form-row"> 
 
                <div className="contact-field"> 
                  <label htmlFor="name"> 
                    Full Name 
                  </label> 
 
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Enter your name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  /> 
                </div> 
 
                <div className="contact-field"> 
                  <label htmlFor="email"> 
                    Email Address 
                  </label> 
 
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  /> 
                </div> 
 
              </div> 
 
              <div className="contact-field"> 
                <label htmlFor="subject"> 
                  Subject 
                </label> 
 
                <input 
                  id="subject" 
                  name="subject" 
                  type="text" 
                  placeholder="What can we help you with?" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                /> 
              </div> 
 
              <div className="contact-field"> 
                <label htmlFor="message"> 
                  Message 
                </label> 
 
                <textarea 
                  id="message" 
                  name="message" 
                  rows="7" 
                  placeholder="Write your message..." 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                ></textarea> 
              </div> 
 
              <button 
                type="submit" 
                className="contact-submit-btn" 
              > 
                Send Message 
                <span>→</span> 
              </button> 
 
              {submitted && ( 
                <div className="contact-success"> 
                  <span>✓</span> 
                  Your message has been submitted successfully. 
                </div> 
              )} 
 
            </form> 
 
          </div> 
 
        </section> 
 
        <section className="contact-support"> 
 
          <div className="contact-support-content"> 
            <span className="contact-eyebrow"> 
              NEED QUICK HELP? 
            </span> 
 
            <h2> 
              Find the right 
              <span> place to start.</span> 
            </h2> 
 
            <p> 
              Whether you're looking for a course or need assistance with 
              your account, LearnSphere has resources to help you move forward. 
            </p> 
          </div> 
 
          <div className="contact-support-grid"> 
 
            <button 
              type="button" 
              className="contact-support-card" 
              onClick={() => window.location.assign("/courses")} 
            > 
              <span className="support-number">01</span> 
 
              <div> 
                <h3>Explore Courses</h3> 
                <p> 
                  Browse our collection of professional courses. 
                </p> 
              </div> 
 
              <span className="support-arrow">↗</span> 
            </button> 
 
            <button 
              type="button" 
              className="contact-support-card" 
              onClick={() => window.location.assign("/instructors")} 
            > 
              <span className="support-number">02</span> 
 
              <div> 
                <h3>Meet Instructors</h3> 
                <p> 
                  Discover experts behind LearnSphere courses. 
                </p> 
              </div> 
 
              <span className="support-arrow">↗</span> 
            </button> 
 
            <button 
              type="button" 
              className="contact-support-card" 
              onClick={() => window.location.assign("/about")} 
            > 
              <span className="support-number">03</span> 
 
              <div> 
                <h3>About LearnSphere</h3> 
                <p> 
                  Learn more about our platform and mission. 
                </p> 
              </div> 
 
              <span className="support-arrow">↗</span> 
            </button> 
 
          </div> 
 
        </section> 
 
      </main> 
 
      <Footer /> 
 
    </div> 
  ) 
} 
 
export default Contact
