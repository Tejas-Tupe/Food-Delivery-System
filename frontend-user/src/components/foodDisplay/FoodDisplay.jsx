import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import { FaStar, FaPlus, FaMinus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const FoodDisplay = ({ category, searchText }) => {
  const { foodList, quantities, increaseQty, decreaseQty } = useContext(StoreContext)

  const filteredFoods = foodList.filter((food) => {
    return (
      (category === 'All' ||
        food.category?.trim().toLowerCase() === category?.trim().toLowerCase()
      ) &&
      food.name.toLowerCase().includes(searchText.toLowerCase())
    )
  })

  return (
    <section className='food-display'>
      <div className='food-display-top'>
        <h2>Top Picks Near You</h2>
        <p>Delicious dishes freshly prepared and delivered fast</p>
      </div>

      <div className='food-grid'>
        {filteredFoods?.map((food, index) => {
          const currentQty = quantities[food.id] || 0

          return (
            // <Link
            //   to={`/food/${food.id}`}
            //   className='food-card-link'
            //   key={food.id || index}
            // >
              <div className='food-card'>
                
                {/* IMAGE CONTAINER */}
                <div className='food-image-container'>
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className='food-image'
                  />

                  {/* FLOATING ACTION COUNTER */}
                  {currentQty === 0 ? (
                    <button
                      className='add-btn'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        increaseQty(food.id)
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
                      <button onClick={() => decreaseQty(food.id)} className='card-counter-btn'>
                        <FaMinus />
                      </button>
                      <span className='card-counter-value'>{currentQty}</span>
                      <button onClick={() => increaseQty(food.id)} className='card-counter-btn'>
                        <FaPlus />
                      </button>
                    </div>
                  )}
                </div>

                {/* INFO CONTENT */}
                <div className='food-info'>
                  <div className='food-header'>
                    <h4>{food.name}</h4>
                    <div className='food-rating'>
                      <FaStar />
                      <span>4.5</span>
                    </div>
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
            //</ Link>
          )
        })}
      </div>
    </section>
  )
}

export default FoodDisplay