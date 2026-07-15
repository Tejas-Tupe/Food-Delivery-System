import api_routes from "../util/APIConfig";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const fetchActiveCart = async () => {
  const response = await fetch(api_routes.GET_CART, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Could not retrieve active cart.');
  return response.json();
};

export const syncAddToCart = async (foodId) => {
  const response = await fetch(api_routes.ADD_TO_CART, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ foodId })
  });
  if (!response.ok) throw new Error('Failed to synchronize add operation.');
  return response.json();
};

export const syncRemoveFromCart = async (foodId) => {
  const response = await fetch(`${api_routes.CLEAR_CART_ITEM}/${foodId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to sync item removal.');
};

export const syncIncreaseQty = async (foodId) => {
  const response = await fetch(`${api_routes.INCREASE_CART_ITEM_QTY}/${foodId}`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to increment quantity.');
};

export const syncDecreaseQty = async (foodId) => {
  const response = await fetch(`${api_routes.DECREASE_CART_ITEM_QTY}/${foodId}`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to decrement quantity.');
};

export const createOrderCheckout = async (orderPayload) => {
  const response = await fetch(api_routes.PLACE_ORDER, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderPayload)
  });
  if (!response.ok) throw new Error('Order creation aborted by backend services.');
  return response.json();
};

export const mergeGuestCart = async (items) => {
  const response = await fetch(
    api_routes.MERGE_CART,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ items })
    }
  );

  if (!response.ok) {
    throw new Error("Merge failed.");
  }
};