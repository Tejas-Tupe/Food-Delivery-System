import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '../../service/ordersevice';
import './IncomingOrders.css'; 

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAdminDashboardOrders("Delivered");
      setOrders(data);
    } catch (error) {
      console.error('Fetch operations failed:', error);
      toast.error('Failed to read delivered orders history from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="food-container">
      <div className="food-header-container">
        <h2 className="food-heading">
          <i className="bi bi-check-circle-fill me-2 text-success"></i> Delivered Orders History
        </h2>
        <p className="food-subheading">Review completed order cycles. These records are permanently finalized.</p>
      </div>

      {loading ? (
        <div className="food-loader">Loading full history indices...</div>
      ) : orders.length === 0 ? (
        <div className="food-nodata">No archived delivered transactions found in storage.</div>
      ) : (
        <div className="food-table-wrapper">
          <table className="food-table">
            <thead>
              <tr>
                <th className="food-th">Order ID</th>
                <th className="food-th">Customer Info</th>
                <th className="food-th">Items Summary</th>
                <th className="food-th">Total Amount</th>
                <th className="food-th">Payment</th>
                <th className="food-th" style={{ textAlign: 'center' }}>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="food-tr">
                  {/* ORDER ID */}
                  <td className="food-td text-bold" style={{ fontSize: '0.85rem' }}>
                    #{order.id}
                  </td>
      
                  <td className="food-td">
                    <div className="customer-info-cell">
                      <strong>{order.email}</strong>
                      <span className="info-address-text">{order.userAddress}</span>
                      <span className="info-phone-text">{order.phoneNumber}</span>
                    </div>
                  </td>

                  <td className="food-td">
                    <div className="order-items-summary">
                      {order.orderitems?.map((item, index) => (
                        <div key={index} className="summary-item-line">
                          • {item.name} <span className="item-qty-tag">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="food-td text-price">₹{order.amount.toFixed(2)}</td>
                  
      
                  <td className="food-td">
                    <span className="food-badge status-paid">{order.paymentStatus}</span>
                  </td>
                  <td className="food-td" style={{ textAlign: 'center' }}>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                      <i className="bi bi-shield-lock-fill me-1"></i> Delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveredOrders;