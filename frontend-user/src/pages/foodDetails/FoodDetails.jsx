import React, { useContext, useEffect, useState } from 'react'
import './FoodDetails.css'
import { FaArrowLeft, FaStar, FaShoppingCart } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { getFoodById } from '../../service/FoodService'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'

const FoodDetails = () => {

  const navigate = useNavigate()
  const { id } = useParams()

  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)

  const {incraseQty, decreaseQty, quantities} = useContext(StoreContext); 

  useEffect(() => {

    const loadFoodDetails = async () => {

      try {

        const response = await getFoodById(id)

        console.log("API RESPONSE:", response)

        setFood(response)  

      } catch (error) {

        console.log(error)
        toast.error('Error occurred while displaying food details')

      } finally {

        setLoading(false)

      }
    }

    loadFoodDetails()

  }, [id])

  if (loading) {
    return (
      <section className='food-details-page'>
        <div className='food-loading'>
          Loading Food Details...
        </div>
      </section>
    )
  }
  if (!food) {
    return (
      <section className='food-details-page'>
        <div className='food-not-found'>
          <h2>Food Not Found</h2>

          <button
            onClick={() => navigate(-1)}
            className='back-btn'
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className='food-details-page'>

      {/* TOP */}
      <div className='food-details-top'>
        <button
          className='back-btn'
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* CARD */}
      <div className='food-details-card'>

        {/* IMAGE */}
        <div className='food-details-image-container'>
          <img
            src={food.imageUrl}
            alt={food.name}
            className='food-details-image'
          />
        </div>

        {/* CONTENT */}
        <div className='food-details-content'>

          <span className='food-details-category'>
            {food.category}
          </span>

          <div className='food-details-header'>
            <h1>{food.name}</h1>

            <div className='food-details-rating'>
              <FaStar />
              <span>4.5</span>
            </div>
          </div>

          <p className='food-details-description'>
            {food.description}
          </p>

          <h2 className='food-details-price'>
            ₹{food.price}
          </h2>

          <div className='food-details-actions'>
            <button className='add-cart-btn'>
              <FaShoppingCart />
              Add To Cart
            </button>
          </div>

        </div>

      </div>

    </section>
  )
}

export default FoodDetails