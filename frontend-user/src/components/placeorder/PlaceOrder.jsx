import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loadRazorpayScript, initializeBackendOrder, verifyPaymentSignature } from '../../service/PaymentService';
import api_routes from '../../util/APIConfig';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, totalCartCount, token, clearCart } = useContext(StoreContext);

  const subtotal = cartItems? cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const deliveryFee = subtotal > 0? 40 : 0;
  const restaurantCharges = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + deliveryFee + restaurantCharges;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const handleInputChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setFormData(prev => ({...prev, [key]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your checkout basket is empty.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Initializing order transaction entries...');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to compile components.');
      }

      const checkoutPackage = { formData, cartItems, totalAmount };

      const backendOrderResponse = await initializeBackendOrder(checkoutPackage, token);

      if (!backendOrderResponse.success) {
        throw new Error(backendOrderResponse.message || 'Order tracking record rejected.');
      }

      const { order } = backendOrderResponse;
      toast.update(toastId, {
        render: 'Awaiting payment authorization...',
        type: 'loading',
        isLoading: true
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_TEST_API_KEY,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Tejas's Foody",
        description: "Secure Order Checkout Settlement",
        order_id: order.razorpayOrderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.mobile
        },
        theme: { color: "#3399cc" },
        handler: async function (response) {
          try {
            toast.update(toastId, {
              render: 'Confirming transaction authorization status...',
              type: 'loading',
              isLoading: true
            });

            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const verificationResult = await verifyPaymentSignature(verificationPayload, token);

            if (verificationResult.success) {
              toast.update(toastId, {
                render: 'Payment captured! Order placed successfully.',
                type: 'success',
                isLoading: false,
                autoClose: 4000
              });

              clearCart();
              navigate('/');
            } else {
              throw new Error('Verification sequence mismatch flagged by security router.');
            }
          } catch (verificationErr) {
            console.error("Payment clearing validation failure:", verificationErr);
            toast.update(toastId, {
              render: "Validation error: Verification confirmation timed out.",
              type: 'error',
              isLoading: false,
              autoClose: 5000
            });
            try {
              await fetch(api_routes.PAYMENT_FAILED, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ razorpay_order_id: order.razorpayOrderId })
              });
            } catch (err) {
              console.error("Failed to sync rejection status to backend:", err);
            }
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: async function () {
            setIsSubmitting(false);
            toast.dismiss(toastId);
            toast.error('Transaction initialization canceled by user.');
            try {
              await fetch(api_routes.PAYMENT_FAILED, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ razorpay_order_id: order.razorpayOrderId })
              });
            } catch (err) {
              console.error("Failed to mark order as rejected on dismiss:", err);
            }
          }
        }
      };

      const paymentWindowInstance = new window.Razorpay(options);

      paymentWindowInstance.on('payment.failed', async function (response) {
        setIsSubmitting(false);
        toast.update(toastId, {
          render: response.error.description || 'Payment failed.',
          type: 'error',
          isLoading: false,
          autoClose: 5000
        });

        try {
          await fetch(api_routes.PAYMENT_FAILED, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ razorpay_order_id: order.razorpayOrderId })
          });
        } catch (err) {
          console.error("Failed to record gateway payment drop status:", err);
        }
      });

      paymentWindowInstance.open();

    } catch (error) {
      console.error("Checkout System Exception Context:", error);
      toast.update(toastId, {
        render: error.message || 'System fault encountered during checkout routing.',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="premium-checkout-page">
      <div className="checkout-main-container">

        <div className="checkout-hero-banner">
          <div className="checkout-brand-badge">
            <span className="badge-primary">Tejas's</span>
            <span className="badge-secondary">Foody</span>
          </div>
          <h2>Secure Checkout</h2>
          <p className="lead-text">Confirm your delivery details and proceed to secure online payment portal processing.</p>
        </div>

        <div className="checkout-grid-layout">
          <div className="checkout-forms-main-column">
            <div className="billing-address-card-wrap">
              <h4 className="section-form-heading"><FaMapMarkerAlt /> Delivery Information</h4>

              <form onSubmit={handleCheckoutSubmit} className="needs-validation">
                <div className="form-fields-row">
                  <div className="form-field-group col-half">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" className="premium-input" id="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field-group col-half">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="premium-input" id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-fields-row">
                  <div className="form-field-group col-half">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input type="tel" className="premium-input" id="mobile" placeholder="10-digit mobile" pattern="[6-9][0-9]{9}" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field-group col-half">
                    <label htmlFor="email">Email Address <span className="optional-text">(Optional)</span></label>
                    <input type="email" className="premium-input" id="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="address">Street Address</label>
                  <input type="text" className="premium-input" id="address" placeholder="Flat, house number, street name, locality" value={formData.address} onChange={handleInputChange} required />
                </div>

                <div className="form-fields-row">
                  <div className="form-field-group col-half">
                    <label htmlFor="city">City / District</label>
                    <input type="text" className="premium-input" id="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field-group col-half">
                    <label htmlFor="state">State / Province</label>
                    <input type="text" className="premium-input" id="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-fields-row">
                  <div className="form-field-group col-half">
                    <label htmlFor="zipCode">Zip / Postal Code</label>
                    <input type="text" className="premium-input" id="zipCode" placeholder="Postal PIN code" pattern="[0-9]{5,10}" value={formData.zipCode} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field-group col-half">
                    <label htmlFor="country">Country</label>
                    <input type="text" className="premium-input" id="country" placeholder="Country" value={formData.country} onChange={handleInputChange} required />
                  </div>
                </div>

                <hr className="form-inner-divider" />
                <h4 className="section-form-heading"><FaCreditCard /> Payment Method</h4>

                <div className="payment-gateway-notice-box">
                  <div className="gateway-indicator-dot animate-pulse"></div>
                  <div className="gateway-text-details">
                    <strong>Secure Online Payment</strong>
                    <p>Supports UPI, NetBanking, Credit/Debit Cards. Payment portal initializes directly upon submission.</p>
                  </div>
                </div>

                <hr className="form-inner-divider" />

                <button
                  className="checkout-dispatch-submit-btn"
                  type="submit"
                  disabled={isSubmitting ||!cartItems || cartItems.length === 0}
                >
                  <FaShieldAlt /> {
                   !cartItems || cartItems.length === 0
                     ? "Your Basket is Empty"
                      : isSubmitting
                       ? "Processing Order..."
                        : `Pay & Place Order ₹${totalAmount}`
                  }
                </button>
              </form>
            </div>
          </div>

          <div className="checkout-sidebar-column">
            <div className="order-summary-sticky-card">
              <h4 className="summary-title-bar">
                <span className="text-highlight">Basket</span>
                <span className="summary-count-pill">{totalCartCount}</span>
              </h4>

              <ul className="summary-items-list">
                {cartItems && cartItems.length > 0? (
                  cartItems.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <li key={itemId} className="summary-item-row">
                        <div className="item-details-stacked">
                          <h6 className="item-name">{item.name}</h6>
                          <small className="item-meta-qty">{item.quantity} × ₹{item.price}</small>
                        </div>
                        <span className="item-row-total">₹{item.price * item.quantity}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="summary-item-row empty-row">
                    <small className="text-muted">Your basket is empty</small>
                  </li>
                )}

                <li className="summary-item-row pricing-calculation-row mt-cl-split">
                  <span className="calc-label">Subtotal</span>
                  <span className="calc-val">₹{subtotal}</span>
                </li>
                <li className="summary-item-row pricing-calculation-row">
                  <span className="calc-label">Delivery & Taxes</span>
                  <span className="calc-val">₹{deliveryFee + restaurantCharges}</span>
                </li>

                <li className="summary-item-row final-total-row">
                  <span>Payable Total</span>
                  <strong>₹{totalAmount}</strong>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;