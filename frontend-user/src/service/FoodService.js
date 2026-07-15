import axios from 'axios'
import api_routes from '../util/APIConfig'

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(api_routes.ALL_FOODS)
        return response.data
    } catch (error) {
        console.log("Error while fetching food list", error)
        return []
    }
}

export const getFoodById = async (id) => {
    try {
        const response = await axios.get(
            `${api_routes.GET_FOOD_BY_ID}${id}`
        )

        console.log("FOOD DETAILS API:", response.data)

        return response.data

    } catch (error) {
        console.log('Error while fetching food details:', error)
        throw error
    }
}