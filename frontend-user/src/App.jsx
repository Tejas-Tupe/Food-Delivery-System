import React from 'react'
import Menubar from './components/menubar/Menubar';
import { Route, Routes } from 'react-router-dom'; 
import Home from './pages/home/Home';
import Contact from './pages/contact/Contact';
import ExploreFood from './pages/exploreFood/ExploreFood';
import FoodDetails from './pages/foodDetails/FoodDetails';
import Cart from './pages/cart/Cart';
import PlaceOrder from './components/placeorder/PlaceOrder';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { ToastContainer } from 'react-toastify';
import UserOrders from './components/userorders/UserOrders';

const App = () => {
  return (
    <div>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/explore' element={<ExploreFood />} />
        <Route path='/food/:id' element={<FoodDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/orders' element={<UserOrders />} />
      </Routes>
    </div>
  )
}

export default App;