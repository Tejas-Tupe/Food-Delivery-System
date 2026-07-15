import React, { useEffect, useState } from 'react';
import assets from '../../assets/assets.js';
import axios from 'axios'
import { toast } from 'react-toastify';
import { foodService } from '../../service/foodService.js';


const AddFood = () => {

  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Select",
    price: ""
  });

  const onChangeHandler = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error('Please upload image');
      return;
    }

    try {
      await foodService.addFood(data, image);
      toast.success('Food added Sucessfully.');
      setData({
        name: "",
        description: "",
        category: "Select",
        price: ""
      })
      setImage(null);
    }
    catch (error) {
      toast.error('Error occured while adding food.')
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add Food Item</h2>
      <div className="card-body">
        <div className="col-md-8 offset-md-2">
          <form onSubmit={onSubmitHandler} className="contact-form shadow p-4 rounded bg-light">

            <div className="mb-3 text-center">
              <label htmlFor="image" className="form-label d-block" style={{ cursor: 'pointer' }}>
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload}
                  alt='Upload Preview'
                  width={150}
                  className="rounded border"
                />
              </label>
              <input
                type="file"
                id="image"
                className="form-control"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Food Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                onChange={onChangeHandler}
                value={data.name}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Food Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="4"
                onChange={onChangeHandler}
                required
                value={data.description}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Food Category</label>
              <select
                name="category"
                id="category"
                className='form-select' // 'form-select' is better styled for Bootstrap 5 dropdowns
                onChange={onChangeHandler}
                value={data.category}
              >
    
                <option value="PIZZA">Pizza</option>
                <option value="BURGER">Burger</option>
                <option value="PASTA">Pasta</option>
                <option value="BIRYANI">Biryani</option>
                <option value="SANDWICH">Sandwich</option>
                <option value="FRIED CHICKEN">Fried Chicken</option>
                <option value="FRENCH FRIES">French Fries</option>
                <option value="ICE CREAM">Ice Cream</option>
                <option value="CAKE">Cake</option>
                <option value="COFFEE">Coffee</option>
                <option value="NOODLES">Noodles</option>
                <option value="PANEER">Paneer</option>
                <option value="SOUTH INDIAN">South Indian</option>
                <option value="SALAD">Salad</option>
                <option value="SHAKES">Shakes</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                onChange={onChangeHandler}
                value={data.price}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;