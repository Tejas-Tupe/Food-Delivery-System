import React, { useContext } from 'react'
import './Menubar.css'
import { assets } from '../../assets/assets.js'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Menubar = () => {
  const navigate = useNavigate()
  
  const { totalUniqueItems, token, logoutUser } = useContext(StoreContext)

  const handleLogoutAction = () => {
    logoutUser() 
    navigate('/login')
  }

  return (
    <nav className="premium-navbar navbar navbar-expand-lg sticky-top">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand premium-logo" to="/">
          <span className="logo-primary">Tejas's</span>
          <span className="logo-secondary">Foody</span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="navbar-actions order-lg-last">

          {/* CART WRAPPER */}
          <Link to="/cart" className="menu-cart-wrap">
            <img src={assets.cart} alt="cart" className="cart-icon" />
            {totalUniqueItems > 0 && (
              <span className="cart-badge">{totalUniqueItems}</span>
            )}
          </Link>

          {/* DESKTOP BUTTONS */}
          <div className="desktop-auth d-none d-md-flex">
            {!token ? (
              <>
                <Link to={'/login'}><button className="nav-btn login-btn">Login</button></Link>
                <Link to={'/register'}><button className="nav-btn register-btn">Register</button></Link>
              </>
            ) : (
              <button className="nav-btn logout-btn" onClick={handleLogoutAction}>Logout</button>
            )}
          </div>

        </div>

        {/* TOGGLER */}
        <button
          className="navbar-toggler premium-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto premium-nav-links">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/explore">Explore</NavLink>
            </li>
            
            {/* PRIVATE ORDERS LINK (Only visible when logged in) */}
            {token && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/orders">Orders</NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
          </ul>

          {/* MOBILE BUTTONS */}
          <div className="mobile-auth d-flex d-md-none">
            {!token ? (
              <>
                <Link to={'/login'} className="w-100"> 
                  <button className="nav-btn login-btn w-100">Login</button>
                </Link>
                <Link to={'/register'} className="w-100"> 
                  <button className="nav-btn register-btn w-100">Register</button>
                </Link>
              </>
            ) : (
              <button className="nav-btn logout-btn w-100" onClick={handleLogoutAction}>Logout</button>
            )}
          </div>
        </div>

      </div>
    </nav>
  )
}
export default Menubar