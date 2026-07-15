import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    <section className="hero-wrapper">
      <div className="hero-overlay"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-badge">
            Fast Delivery • Fresh Food
          </span>

          <h1>
            Discover & Order
            <span> Delicious Food</span>
          </h1>

          <p>
            Explore premium dishes crafted with fresh ingredients,
            rich flavors, and unforgettable culinary experiences —
            delivered directly to your doorstep.
          </p>

          <div className="hero-buttons">
            <Link to="/explore" className="hero-btn primary-btn">
              Explore Menu
            </Link>

            <Link to="/about" className="hero-btn secondary-btn">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header