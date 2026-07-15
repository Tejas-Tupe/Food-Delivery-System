import React from 'react'
import './Contact.css'
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from 'react-icons/fa'

const ContactUs = () => {
  return (
    <section className='contact-page'>

      {/* HERO */}
      <div className='contact-hero'>
        <span className='contact-badge'>
          Get In Touch
        </span>

        <h1>
          Contact Us
        </h1>

        <p>
          We would love to hear from you. Reach out for support,
          partnerships, feedback, or any inquiries.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className='contact-container'>

        {/* INFO CARD */}
        <div className='contact-info-card'>
          <h2>
            Let's Connect
          </h2>

          <p>
            Our team is always ready to help you with your food
            delivery experience.
          </p>

          <div className='contact-info-list'>

            <div className='contact-info-item'>
              <div className='contact-icon'>
                <FaEnvelope />
              </div>
              <div>
                <h5>Email</h5>
                <span>support@Tejas.Foody.com</span>
              </div>
            </div>

            <div className='contact-info-item'>
              <div className='contact-icon'>
                <FaPhoneAlt />
              </div>
              <div>
                <h5>Phone</h5>
                <span>+91 9762189822</span>
              </div>
            </div>

            <div className='contact-info-item'>
              <div className='contact-icon'>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h5>Location</h5>
                <span>CSN, Maharashtra</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  )
}

export default ContactUs