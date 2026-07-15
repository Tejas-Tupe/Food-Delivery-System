import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AddFood from "./pages/addFood/AddFood";
import ListFood from "./pages/listFood/ListFood";
import Sidebar from "./components/sidebar/Sidebar";
import Menubar from "./components/menubar/Menubar";
import {ToastContainer, toast} from 'react-toastify';
import IncomingOrders from "./pages/adminOrders/IncomingOrders";
import PreparingOrders from "./pages/adminOrders/PreparingOrders";
import EnrouteOrders from "./pages/adminOrders/EnrouteOrders";
import DeliveredOrders from "./pages/adminOrders/DeliveredOrders";

const App = () => {

    const [sidebarVisible, setsidebarVisible] = useState(true);

    const toggleSideBar = () => {
        setsidebarVisible(!sidebarVisible);
    }

    return (
        <div className="d-flex" id="wrapper">

            <Sidebar sidebarVisible={sidebarVisible}/>

            <div id="page-content-wrapper">

                <Menubar toggleSideBar={toggleSideBar}/>
                <ToastContainer />

                <div className="container-fluid">
                    <Routes>
                        <Route path="/add" element={<AddFood />}></Route>
                        <Route path="/list" element={<ListFood />}></Route>
                        <Route path="/" element={<ListFood />}></Route>
                        <Route path="/incoming-orders" element={<IncomingOrders />}></Route>
                        <Route path="/preparing-orders" element={<PreparingOrders />}></Route>
                        <Route path="/enroute-orders" element={<EnrouteOrders />}></Route>
                        <Route path="/delivered-orders" element={<DeliveredOrders />}></Route>
                    </Routes>
                </div>

            </div>

        </div>
    )
}

export default App;