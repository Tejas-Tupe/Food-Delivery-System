import axios from 'axios';
import api_routes from '../util/APIConfig';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initializeBackendOrder = async (checkoutData, token) => {
  const config = { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  };

  const { formData, cartItems, totalAmount } = checkoutData;

  const computedAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode}, ${formData.country}`;

  const mappedOrderItems = cartItems.map(item => ({
    foodId: item.id || item._id,
    price: Number(item.price),
    category: item.category || "",
    imgurl: item.image || item.imgurl || "", 
    description: item.description || "",
    name: item.name,
    quantity: Number(item.quantity)
  }));

  const orderRequestPayload = {
    orderItems: mappedOrderItems,
    userAddress: computedAddress,
    phoneNumber: formData.mobile,
    email: formData.email,
    amount: totalAmount,
    orderStatus: "Pending"
  };

  const response = await axios.post(api_routes.CREATE_ORDER, orderRequestPayload, config);
  
  if (response.data) {
    return { success: true,  order: response.data };
  }
  return { success: false, message: "Failed to generate checkout context data." };
};

/**
 * Sends transaction signatures to backend matching @PostMapping("/verify") route maps
 */
export const verifyPaymentSignature = async (paymentDetails, token) => {
  const config = { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  };
  
  // Uses dynamic centralized route mapping
  const response = await axios.post(api_routes.VERIFY_ORDER, paymentDetails, config);
  
  if (response.status === 204 || response.status === 200) {
    return { success: true };
  }
  return { success: false };
};