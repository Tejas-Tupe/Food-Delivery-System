import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '../../service/ordersevice';
import './IncomingOrders.css';

const PreparingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAdminDashboardOrders("Preparing");
      setOrders(data);
    } catch (error) {
      console.error('Fetch operations failed:', error);
      toast.error('Failed to read preparing orders list from server.');
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Confirm status transition to "${newStatus}"?`)) {
      console.log("Sending status:", newStatus);
      return;
    }

    try {
      await orderService.changeOrderStatus(orderId, newStatus);
      toast.success(`Order successfully marked as ${newStatus}.`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Status update operation failed:', error);
      toast.error('Could not complete status configuration change.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="food-container">
      <div className="food-header-container">
        <h2 className="food-heading">
          <i className="bi bi-fire me-2 text-danger"></i> Kitchen Preparing Orders
        </h2>
        <p className="food-subheading">Monitor active food preparation and ensure timely handoffs to delivery riders.</p>
      </div>

      {loading ? (
        <div className="food-loader">Loading active kitchen prep orders...</div>
      ) : orders.length === 0 ? (
        <div className="food-nodata">No orders are currently in preparation in the kitchen.</div>
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
                <th className="food-th" style={{ textAlign: 'center' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="food-tr">
    
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
                    <select
                      className="status-select-dropdown"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="Enroute">Enroute</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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

export default PreparingOrders;