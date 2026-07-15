import React, { useContext } from 'react';
import './Cart.css';
import { FaTrashAlt, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const FoodCart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, increaseQty, decreaseQty, removeFromCart, token } = useContext(StoreContext);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const restaurantCharges = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + deliveryFee + restaurantCharges;

  const isLoggedIn = !!token;

  if (loading) {
    return (
      <section className="food-cart-page">
        <div className="cart-loading-box">
          <div className="premium-spinner"></div>
          <p>Retrieving your fresh cart details...</p>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="food-cart-page">
        <div className="cart-empty-card">
          <div className="cart-empty-icon"><FaShoppingBag /></div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your order panel yet.</p>
          <button onClick={() => navigate('/explore')} className="explore-btn">
            <FaArrowLeft /> Explore Food Menu
          </button>
        </div>
      </section>
    );
  }

  const handleCheckoutClick = () => {
    if (isLoggedIn) {
      navigate('/placeorder');
    } else {
      navigate('/login', { state: { from: '/cart' } }); 
    }
  };

  return (
    <section className="food-cart-page">
      <div className="cart-page-header">
        <h1>Your Food Cart</h1>
        <span className="cart-count-badge">{cartItems.length} Unique Items</span>
      </div>

      <div className="cart-page-grid">
        
        <div className="cart-items-wrapper">
          {cartItems.map((item) => {
            const itemId = item.id || item._id;
            
            return (
              <div key={itemId} className="cart-item-card">
                
                <div className="cart-item-image-container">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                </div>

                <div className="cart-item-details">
                  <span className="cart-item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <h4 className="cart-item-single-price">₹{item.price} each</h4>
                </div>
                <div className="cart-item-actions-wrapper">
                  <div className="cart-qty-counter-box">
                    <button onClick={() => decreaseQty(itemId)} className="cart-box-btn">
                      <FaMinus />
                    </button>
                    <span className="cart-box-value">{item.quantity}</span>
                    <button onClick={() => increaseQty(itemId)} className="cart-box-btn">
                      <FaPlus />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(itemId)} 
                    className="cart-trash-action-btn"
                    title="Remove from checkout list"
                  >
                    <FaTrashAlt />
                  </button>
                </div>

                <div className="cart-item-total-block">
                  <span>₹{item.price * item.quantity}</span>
                </div>

              </div>
            );
          })}
        </div>

        <div className="cart-summary-card">
          <h2>Bill Details</h2>
          
          <div className="summary-row">
            <span className="summary-label">Item Subtotal</span>
            <span className="summary-value">₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Delivery Fee</span>
            <span className="summary-value">₹{deliveryFee}</span>
          </div>

          <div className="summary-row tax-row">
            <span className="summary-label">Govt Taxes & Restaurant Charges (5%)</span>
            <span className="summary-value">₹{restaurantCharges}</span>
          </div>

          <hr className="summary-divider" />

          <div className="summary-row total-row">
            <span className="total-label">To Pay</span>
            <span className="total-value">₹{totalAmount}</span>
          </div>
          <button 
            className={`checkout-btn ${!isLoggedIn ? 'auth-required-btn' : ''}`} 
            onClick={handleCheckoutClick}
          >
            {isLoggedIn ? 'Proceed To Checkout' : 'Login to Place Order'}
          </button>
        </div>

      </div>
    </section>
  );
};

export default FoodCart;