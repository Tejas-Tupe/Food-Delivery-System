import React, { useRef } from 'react'
import './ExploreMenu.css'
import { categories } from '../../assets/assets.js'

const ExploreMenu = ({ category, setCategory }) => {

  const scrollContainerRef = useRef(null)

  /* ==========================================
     SCROLL HANDLER
     ========================================== */

  const handleScroll = (direction) => {

    if (scrollContainerRef.current) {

      const scrollAmount = 280

      scrollContainerRef.current.scrollBy({
        left: direction === 'left'
          ? -scrollAmount
          : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  /* ==========================================
     CATEGORY SELECT
     ========================================== */

  const handleCategoryClick = (selectedCategory) => {

    if (category === selectedCategory) {

      setCategory('All')

    } else {

      setCategory(selectedCategory)

    }
  }

  return (

    <section className='explore-section'>

      {/* TOP SECTION */}

      <div className='explore-header'>

        <div>

          <span className='explore-badge'>
            Curated Categories
          </span>

          <h2>
            Explore Our Menu
          </h2>

          <p>
            Discover handcrafted dishes from premium food categories
            prepared with fresh ingredients and authentic flavors.
          </p>

        </div>

        {/* SCROLL BUTTONS */}

        <div className='scroll-controls'>

          <button
            className='scroll-btn'
            onClick={() => handleScroll('left')}
          >
            <i className='bi bi-arrow-left'></i>
          </button>

          <button
            className='scroll-btn'
            onClick={() => handleScroll('right')}
          >
            <i className='bi bi-arrow-right'></i>
          </button>

        </div>

      </div>

      {/* CATEGORY LIST */}

      <div
        className='category-scroll-wrapper'
        ref={scrollContainerRef}
      >

        {/* ALL CATEGORY */}

        <div
          className={`category-card ${category === 'All' ? 'active-category' : ''
            }`}
          onClick={() => setCategory('All')}
        >

          <div className='category-image-wrapper'>

            <div className='all-category-icon'>
              <i className='bi bi-grid'></i>
            </div>

          </div>

          <h6>
            All
          </h6>

        </div>

        {/* DYNAMIC CATEGORIES */}

        {
          categories.map((item, index) => (

            <div
              key={index}
              className={`category-card ${category === item.category
                  ? 'active-category'
                  : ''
                }`}
              onClick={() =>
                handleCategoryClick(item.category)
              }
            >

              <div className='category-image-wrapper'>

                <img
                  src={item.icon}
                  alt={item.category}
                  className='category-image'
                />

              </div>

              <h6>
                {item.category}
              </h6>

            </div>
          ))
        }

      </div>

    </section>
  )
}

export default ExploreMenu