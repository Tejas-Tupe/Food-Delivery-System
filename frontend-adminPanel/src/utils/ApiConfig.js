const url = import.meta.env.VITE_BACKEND_SERVER_URL

const api_routes = {
    GET_FOODS: `${url}/foods`,
    ADD_FOOD: `${url}/foods`,
    DELETE_FOOD: `${url}/foods`,
    GET_ORDERS:`${url}/admin-orders/list`,
    CHANGE_STATUS:`${url}/admin-orders/status` // needs orderId
}

export default api_routes;