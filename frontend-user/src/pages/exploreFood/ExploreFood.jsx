import React, { useState } from 'react'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'
import './ExploreFood.css'

const ExploreFood = () => {

  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (

    <section className='explore-food-page'>

      <div className='explore-food-hero'>

        <h1>
          Discover Delicious Food
        </h1>

        <p>
          Search your favorite meals and explore premium dishes near you
        </p>

      </div>

      <div className='explore-food-search-wrapper'>

        <form className='explore-food-form' onSubmit={(e) => e.preventDefault()}>

          <input
            type='text'
            className='explore-food-input'
            placeholder='Search your cravings'
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button
            className='explore-food-btn'
            type='submit'
          >

            <i className='bi bi-search'></i>

          </button>

        </form>

      </div>

      <FoodDisplay category={category} searchText={searchText} />
    
    </section>
  )
}

export default ExploreFood