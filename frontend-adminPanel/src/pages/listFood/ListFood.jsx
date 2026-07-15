import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {foodService}  from './../../service/foodService.js'; 
import './ListFood.css';

const ListFood = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const data = await foodService.getAllFoods();
      setList(data);
    } catch (error) {
      console.error('Fetch operation failed:', error);
      toast.error('Failed to read the food list from server.');
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) {
      return; 
    }

    try {
      await foodService.deleteFoodById(id);
      toast.success('Food item deleted successfully!');
    
      setList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Delete operation failed:', error);
      toast.error('Could not process the deletion request.');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="food-container">
      <div className="food-header-container">
        <h2 className="food-heading">All Foods List</h2>
        <p className="food-subheading">Manage and view your menu items efficiently.</p>
      </div>

      {loading ? (
        <div className="food-loader">Loading your menu...</div>
      ) : list.length === 0 ? (
        <div className="food-nodata">No food items found. Add some to get started!</div>
      ) : (
        <div className="food-table-wrapper">
          <table className="food-table">
            <thead>
              <tr>
                <th className="food-th">Image</th>
                <th className="food-th">Name</th>
                <th className="food-th">Category</th>
                <th className="food-th">Description</th>
                <th className="food-th">Price</th>
                <th className="food-th" style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="food-tr">
                  <td className="food-td">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="food-thumbnail"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/50x50?text=Food';
                      }}
                    />
                  </td>
                  <td className="food-td text-bold">{item.name}</td>
                  <td className="food-td">
                    <span className="food-badge">{item.category}</span>
                  </td>
                  <td className="food-td text-description">{item.description}</td>
                  <td className="food-td text-price">₹{item.price}</td>
                  <td className="food-td" style={{ textAlign: 'center' }}>
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteFood(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListFood;