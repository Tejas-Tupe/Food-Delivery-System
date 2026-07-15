import React from 'react'

import { Link } from 'react-router-dom'

import assets from '../../assets/assets.js' 

const Sidebar = ({sidebarVisible}) => {
  return (
    <div className={`border-end bg-white ${sidebarVisible ? '' : `d-none`}`} id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">
        <img src={assets.logo} alt='logo image' height={52} width={52}></img>
      </div>
      <div className="list-group list-group-flush">
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/add">
        <i className='bi bi-plus-circle me-2'></i>Add Food</Link>
        
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/list">
        <i className='bi bi-list-ul me-2'></i>List Food</Link>
        
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/incoming-orders">
        <i className="bi bi-bell-fill"></i> Incoming Orders</Link>
        
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/preparing-orders">
        <i className="bi bi-egg-fried"></i> Preparing Orders</Link>
        
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/enroute-orders">
        <i className="bi bi-truck"></i> Out for Delivary Orders</Link>
        
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/delivered-orders">
        <i className="bi bi-check-circle-fill"></i> Delivared Orders</Link>
      </div>
    </div>
  )
}

export default Sidebar