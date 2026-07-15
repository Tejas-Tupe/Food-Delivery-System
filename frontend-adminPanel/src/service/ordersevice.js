import axios from 'axios';
import api_routes from '../utils/ApiConfig';

export const orderService = { 
  
  getAdminDashboardOrders: async (status) => {
    try {
      const response = await axios.get(`${api_routes.GET_ORDERS}/${status}`);
      return response.data;
    } catch (error) { 
      console.error('Error in getAdminDashboardOrders:', error);
      throw error;
    }
  },

  changeOrderStatus: async (orderId, newStatus) => {
    try {
      const payload = { orderStatus: newStatus };
      
      const response = await axios.patch(
        `${api_routes.CHANGE_STATUS}/${orderId}`, 
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error in changeOrderStatus:', error);
      throw error;
    }
  }
};