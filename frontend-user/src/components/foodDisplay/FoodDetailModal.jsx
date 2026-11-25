import React, { useContext, useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaPlus, 
  FaMinus, 
  FaClock, 
  FaFire, 
  FaShieldAlt, 
  FaShoppingBag,
  FaTag
} from 'react-icons/fa';
import { StoreContext } from '../../context/StoreContext';
import './FoodDetailModal.css';

const FoodDetailModal = ({ food, onClose, onSelectFood }) => {
  const { foodList, quantities, increaseQty, decreaseQty } = useContext(StoreContext);
  const [cookingNote, setCookingNote] = useState('');

  // Reset cooking note & scroll modal top when switching items
  useEffect(() => {
    setCookingNote('');
    const modalBody = document.querySelector('.food-modal-scroll-body');
    if (modalBody) modalBody.scrollTop = 0;
  }, [food]);

  // Close on Escape key press & lock background scroll
  useEffect(() => {
    if (!food) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [food, onClose]);

  if (!food) return null;

  const foodId = food.id || food._id;
  const currentQty = quantities[foodId] || 0;

  // Build "More Like This" list (prioritize same category, fallback to other items)
  const sameCategoryItems = (foodList || []).filter(
    (item) =>
      (item.id || item._id) !== foodId &&
      item.category?.trim().toLowerCase() === food.category?.trim().toLowerCase()
  );

  const otherItems = (foodList || []).filter(
    (item) =>
      (item.id || item._id) !== foodId &&
      item.category?.trim().toLowerCase() !== food.category?.trim().toLowerCase()
  );

  const recommendedFoods = [...sameCategoryItems, ...otherItems].slice(0, 6);

  return (
    <div className="food-modal-backdrop" onClick={onClose}>
      <div 
        className="food-modal-container animate-modal-pop" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* FLOATING CLOSE BUTTON */}
        <button className="food-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <FaTimes />
        </button>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="food-modal-scroll-body">
          {/* HERO IMAGE BANNER */}
          <div className="food-modal-hero">
            <img src={food.imageUrl} alt={food.name} className="food-modal-hero-img" />
            <span className="food-modal-category-pill">
              <FaTag /> {food.category}
            </span>
          </div>

          {/* MAIN FOOD DETAILS */}
          <div className="food-modal-content">
            <div className="food-modal-header-row">
              <h2 className="food-modal-title">{food.name}</h2>
              <span className="food-modal-price">₹{food.price}</span>
            </div>

            {/* TRUST & PREP BADGES */}
            <div className="food-modal-meta-badges">
              <span className="meta-badge">
                <FaClock className="meta-icon" /> 20–25 mins
              </span>
              <span className="meta-badge">
                <FaFire className="meta-icon" /> Freshly Prepared
              </span>
              <span className="meta-badge">
                <FaShieldAlt className="meta-icon" /> Hygienic Packaging
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="food-modal-desc-box">
              <h4>About this dish</h4>
              <p>
                {food.description && food.description.trim().toLowerCase() !== food.name.trim().toLowerCase()
                  ? food.description
                  : `Freshly crafted ${food.name} prepared to order with quality ingredients and authentic flavors in our ${food.category} kitchen.`}
              </p>
            </div>

            {/* OPTIONAL COOKING INSTRUCTIONS */}
            <div className="food-modal-note-box">
              <label htmlFor="cookingNote">Special Preparation Instructions (Optional)</label>
              <input
                id="cookingNote"
                type="text"
                placeholder="e.g., Less spicy, extra sauce, no onions..."
                value={cookingNote}
                onChange={(e) => setCookingNote(e.target.value)}
                className="food-modal-note-input"
              />
            </div>

            {/* PRIMARY ADD / QUANTITY ACTION BAR */}
            <div className="food-modal-action-bar">
              {currentQty === 0 ? (
                <button 
                  className="modal-primary-add-btn" 
                  onClick={() => increaseQty(foodId)}
                >
                  <FaShoppingBag /> Add to Cart • ₹{food.price}
                </button>
              ) : (
                <div className="modal-qty-control-wrapper">
                  <div className="modal-qty-stepper">
                    <button onClick={() => decreaseQty(foodId)} aria-label="Decrease quantity">
                      <FaMinus />
                    </button>
                    <span>{currentQty}</span>
                    <button onClick={() => increaseQty(foodId)} aria-label="Increase quantity">
                      <FaPlus />
                    </button>
                  </div>
                  <div className="modal-subtotal-pill">
                    Item Total: <strong>₹{(food.price * currentQty).toFixed(2)}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* APPENDED FOOD LIST: PAIR WITH / MORE DISHES */}
            {recommendedFoods.length > 0 && (
              <div className="food-modal-recommendations">
                <div className="rec-section-header">
                  <h3>Frequently Ordered & More</h3>
                  <span>Tap any item to view details</span>
                </div>

                <div className="rec-food-list">
                  {recommendedFoods.map((item) => {
                    const recId = item.id || item._id;
                    const recQty = quantities[recId] || 0;

                    return (
                      <div 
                        key={recId} 
                        className="rec-food-item-card"
                        onClick={() => onSelectFood(item)}
                      >
                        <img src={item.imageUrl} alt={item.name} className="rec-food-thumb" />
                        
                        <div className="rec-food-details">
                          <span className="rec-food-cat">{item.category}</span>
                          <h5>{item.name}</h5>
                          <span className="rec-food-price">₹{item.price}</span>
                        </div>

                        <div 
                          className="rec-food-action"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {recQty === 0 ? (
                            <button 
                              className="rec-add-btn"
                              onClick={() => increaseQty(recId)}
                            >
                              <FaPlus /> Add
                            </button>
                          ) : (
                            <div className="rec-mini-counter">
                              <button onClick={() => decreaseQty(recId)}><FaMinus /></button>
                              <span>{recQty}</span>
                              <button onClick={() => increaseQty(recId)}><FaPlus /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;