import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Layout from './Pages/Layout';
import AdminDashboard from './Pages/AdminDashboard';
import Products from './Pages/Products';
import Cart from './Pages/Cart';
import AddProduct from './Pages/AddProduct';
import AddSupplier from './Pages/AddSupplier';
import Orders from './Pages/Orders';
import ProfileUpdate from './Pages/ProfileUpdate';

const App = () => {
  return (
    <div className="font-body">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/adminDashboard" element={<Layout children={<AdminDashboard />} />} />
          <Route path="/Products" element={<Layout children={<Products />} />} />
          <Route path="/Cart" element={<Layout children={<Cart />} />} />
          <Route path="/addProduct" element={<Layout children={<AddProduct />} />} />
          <Route path="/addSupplier" element={<Layout children={<AddSupplier />} />} />
          <Route path="/orders" element={<Layout children={<Orders />} />} />
          <Route path="/profile" element={<Layout children={<ProfileUpdate />} />} />

          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
