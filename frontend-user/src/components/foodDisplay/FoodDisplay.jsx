import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { FaStar, FaPlus, FaMinus } from 'react-icons/fa'
import FoodDetailModal from './FoodDetailModal.jsx'
import './FoodDisplay.css'
const FoodDisplay = ({ category, searchText }) => {
  // Extract foodList and loading state from StoreContext
  const { foodList, quantities, increaseQty, decreaseQty, loading } = useContext(StoreContext)
  
  // State to track which food card was clicked
  const [selectedFood, setSelectedFood] = useState(null)

  // Filter foods based on category and search query
  const filteredFoods = foodList?.filter((food) => {
    return (
      (category === 'All' ||
        food.category?.trim().toLowerCase() === category?.trim().toLowerCase()
      ) &&
      food.name?.toLowerCase().includes((searchText || '').toLowerCase())
    )
  })

  // Determine if backend is currently sleeping / fetching data
  const isLoading = loading || !foodList || foodList.length === 0

  return (
    <section className='food-display'>
      <div className='food-display-top'>
        <h2>Top Picks Near You</h2>
        <p>Delicious dishes freshly prepared and delivered fast</p>
      </div>

      <div className='food-grid'>
        {/* SHOW SKELETON LOADERS WHILE BACKEND WAKES UP */}
        {isLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div className='food-card skeleton-card' key={idx}>
              <div className='skeleton-image' />
              <div className='food-info'>
                <div className='skeleton-title' />
                <div className='skeleton-text' />
                <div className='skeleton-text short' />
                <div className='skeleton-footer' />
              </div>
            </div>
          ))
        ) : filteredFoods?.length === 0 ? (
          /* NO MATCHING RESULTS STATE */
          <div className='no-food-found'>
            <p>No dishes found matching your criteria.</p>
          </div>
        ) : (
          /* ACTUAL FOOD CARDS - CLICKABLE TO OPEN DETAIL MODAL */
          filteredFoods.map((food, index) => {
            const foodId = food.id || food._id
            const currentQty = quantities[foodId] || 0

            return (
              <div
                className='food-card'
                key={foodId || index}
                onClick={() => setSelectedFood(food)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedFood(food)
                  }
                }}
              >
                {/* IMAGE CONTAINER */}
                <div className='food-image-container'>
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className='food-image'
                    loading="lazy"
                  />

                  {/* FLOATING ACTION COUNTER */}
                  {currentQty === 0 ? (
                    <button
                      className='add-btn'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        increaseQty(foodId)
                      }}
                    >
                      <FaPlus />
                    </button>
                  ) : (
                    <div
                      className='food-card-counter'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <button onClick={() => decreaseQty(foodId)} className='card-counter-btn'>
                        <FaMinus />
                      </button>
                      <span className='card-counter-value'>{currentQty}</span>
                      <button onClick={() => increaseQty(foodId)} className='card-counter-btn'>
                        <FaPlus />
                      </button>
                    </div>
                  )}
                </div>

                {/* INFO CONTENT */}
                <div className='food-info'>
                  <div className='food-header'>
                    <h4>{food.name}</h4>
                  </div>

                  <p className='food-description'>
                    {food.description?.length > 65
                      ? `${food.description.slice(0, 65)}...`
                      : food.description}
                  </p>

                  <div className='food-footer'>
                    <span className='food-category'>{food.category}</span>
                    <h5 className='food-price'>₹{food.price}</h5>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* DETAILED FOOD WINDOW MODAL */}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
        onSelectFood={(clickedFood) => setSelectedFood(clickedFood)}
      />
    </section>
  )
}

export default FoodDisplay