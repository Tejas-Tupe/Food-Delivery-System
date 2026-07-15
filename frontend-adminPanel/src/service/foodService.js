import axios from "axios";

import api_routes from "../utils/ApiConfig";

export const foodService = {
  /**
   * Fetches the complete list of food items from the server
   * @returns {Promise<Array>} Array of food item objects
   */
  getAllFoods: async () => {
    const response = await axios.get(api_routes.GET_FOODS);
    return response.data;
  },

  /**
   * Deletes a specific food item by its unique ID string
   * @param {string} id 
   * @returns {Promise<Object>} Response confirmation object
   */
  deleteFoodById: async (id) => {
    const response = await axios.delete(`${api_routes.DELETE_FOOD}/${id}`);
    return response.data;
  },

  /**
   * Uploads a new food item with its image file using FormData
   * @param {Object} foodData - The text fields (name, price, etc.)
   * @param {File} image - The actual binary image file from the input
   */
  addFood: async (foodData, image) => {
    const formData = new FormData();
    
    // We append the JSON data as a Blob so spring-boot/backend parses it properly
    formData.append(
      'food', 
      new Blob([JSON.stringify(foodData)], { type: "application/json" })
    );
    formData.append('file', image);

    const response = await axios.post(api_routes.ADD_FOOD, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }
};