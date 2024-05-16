import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Person2Icon from '@mui/icons-material/Person2';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { fetchUserCount, fetchUserDetails } from './Redux/userSlice';
import { fetchProducts } from './Redux/productSlice';
import { fetchOrders, fetchTotalSales } from './Redux/orderSlice';
import AddAdmin from './Pages/AddAdmin';

const App = () => {
  const dispatch = useDispatch();
  const { userCount, role } = useSelector((state) => state.user)
  const { products } = useSelector((state) => state.product)
  const totalSales = useSelector((state) => state.order.totalSales)
  const totalOrders = useSelector((state) => state.order.orders)
  useEffect(() => {

    if (!role) { dispatch(fetchUserDetails()) }
    if (role == "admin") {
      if (!userCount) {
        dispatch(fetchUserCount());
      }
      if (!products) {
        dispatch(fetchProducts());
      }
      if (!totalSales) {
        dispatch((fetchTotalSales()))
      }
      if (!totalOrders) {
        dispatch((fetchOrders()))
      }
    }

  }, [dispatch, role])




  let accessibleRoutes = null;
  if (role === 'admin') {
    accessibleRoutes = [{ name: 'Dashboard', route: '/Admindashboard', icon: DashboardIcon },
    { name: 'Profile', route: '/profile', icon: Person2Icon },
    { name: 'Products', route: '/products', icon: InventoryIcon },
    { name: 'Orders', route: '/orders', icon: ShoppingCartCheckoutIcon },
    { name: 'Add Supplier', route: '/addSupplier', icon: PersonAddIcon },
    { name: 'Place Order', route: '/products', icon: AddShoppingCartIcon },
    { name: 'Cart', route: '/cart', icon: ShoppingCartIcon },
    { name: 'Add Product', route: '/addProduct', icon: AddShoppingCartIcon }]



  }


  if (role === 'manager') {
    accessibleRoutes = [{ name: 'Dashboard', route: '/Admindashboard', icon: DashboardIcon },
    { name: 'Profile', route: '/profile', icon: Person2Icon },
    { name: 'Products', route: '/products', icon: InventoryIcon },
    { name: 'Orders', route: '/orders', icon: ShoppingCartCheckoutIcon },
    { name: 'Add Supplier', route: '/addSupplier', icon: PersonAddIcon },
    { name: 'Place Order', route: '/products', icon: AddShoppingCartIcon },
    { name: 'Cart', route: '/cart', icon: ShoppingCartIcon },
    { name: 'Add Product', route: '/addProduct', icon: AddShoppingCartIcon },
    { name: 'Add admin', route: '/addProduct', icon: AddShoppingCartIcon },
    ]
  }

  if (role === 'customer') {
    console.log("hello");
    accessibleRoutes = [
      { name: 'Profile', route: '/profile', icon: Person2Icon },
      { name: 'Products', route: '/products', icon: InventoryIcon },
      { name: 'Place Order', route: '/products', icon: AddShoppingCartIcon },
      { name: 'Cart', route: '/cart', icon: ShoppingCartIcon },
    ]
  }







  return (
    <div className="font-body">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Layout routes={accessibleRoutes} children={<Home />} />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/adminDashboard" element={<Layout routes={accessibleRoutes} children={<AdminDashboard />} />} />
          <Route path="/Products" element={<Layout routes={accessibleRoutes} children={<Products />} />} />
          <Route path="/Cart" element={<Layout routes={accessibleRoutes} children={<Cart />} />} />
          <Route path="/addProduct" element={<Layout routes={accessibleRoutes} children={<AddProduct />} />} />
          <Route path="/addSupplier" element={<Layout routes={accessibleRoutes} children={<AddSupplier />} />} />
          <Route path="/orders" element={<Layout routes={accessibleRoutes} children={<Orders />} />} />
          <Route path="/profile" element={<Layout routes={accessibleRoutes} children={<ProfileUpdate />} />} />
          <Route path="/addAdmin" element={<Layout routes={accessibleRoutes} children={<AddAdmin />} />} />

          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
