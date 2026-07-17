import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import './UserOrders.css'
import { StoreContext } from '../../context/StoreContext'
import { FaBox, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaClock } from 'react-icons/fa'
import api_routes from '../../util/APIConfig'

const UserOrders = () => {
  const { token } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetching live order data from your API
  const fetchOrders = async () => {
    try {
      // Replace with your exact backend endpoint URL
      const response = await axios.get(api_routes.USER_ALL_ORDERS, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user orders:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your delicious updates...</p>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>Your Orders</h1>
          <p>Track and manage your current and past food journeys.</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <FaBox className="empty-icon" />
            <h3>No orders placed yet</h3>
            <p>Looks like you haven't ordered anything yet. Head over to Explore!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                
                {/* CARD TOP HEADER */}
                <div className="order-card-header">
                  <div className="order-id-block">
                    <span className="order-label">ORDER ID</span>
                    <span className="order-id">#{order.id}</span>
                  </div>
                  <div className="order-badges">
                    <span className={`status-badge payment-${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                    <span className={`status-badge track-${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus === 'confirmed' ? <FaCheckCircle /> : <FaClock />}
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* MIDDLE SECTION: ITEMS ORDERED */}
                <div className="order-card-body">
                  <div className="order-items-section">
                    <h5>Items Ordered</h5>
                    <div className="items-grid">
                      {order.orderitems.map((item, idx) => (
                        <div key={idx} className="ordered-item-row">
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-meta">{item.category} • {item.description}</span>
                          </div>
                          <div className="item-pricing">
                            <span className="item-qty">x{item.quantity}</span>
                            <span className="item-cost">₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DELIVERY DETAILS */}
                  <div className="order-delivery-section">
                    <div className="delivery-info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <p><span>Deliver to:</span> {order.userAddress}</p>
                    </div>
                    <div className="delivery-info-item">
                      <FaPhoneAlt className="info-icon" />
                      <p><span>Contact:</span> {order.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER: TOTAL COST */}
                <div className="order-card-footer">
                  <div className="total-label">Total Amount Paid</div>
                  <div className="total-amount">₹{order.amount.toFixed(2)}</div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrders;