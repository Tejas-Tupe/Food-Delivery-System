const url = import.meta.env.VITE_BACKEND_SERVER_URL

const api_routes = {
    REGISTER: `${url}/register`,
    LOGIN: `${url}/login`,
    
    ALL_FOODS: `${url}/foods`,
    GET_FOOD_BY_ID: `${url}/foods/`,

    ADD_TO_CART: `${url}/cart`,
    GET_CART: `${url}/cart`,
    CLEAR_CART: `${url}/cart`,
    CLEAR_CART_ITEM:`${url}/cart`, // need id
    INCREASE_CART_ITEM_QTY:`${url}/cart/increase`, // increase
    DECREASE_CART_ITEM_QTY:`${url}/cart/decrease`, // decrease
    MERGE_CART: `${url}/cart/merge`,

    CREATE_ORDER:`${url}/orders/create`,
    VERIFY_ORDER:`${url}/orders/verify`,
    DELETE_ORDER:`${url}/orders`, // need orderid attach at end
    USER_ALL_ORDERS:`${url}/orders/userorders`,
    ORDER_STATUS:`${url}/orders/status`, // need orderid attach at end
    PAYMENT_FAILED:`${url}/orders/payment-failed`
}

export default api_routes;