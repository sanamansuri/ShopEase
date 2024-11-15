import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Home from './pages/home/Home';
import Order from './pages/order/Order';
import Cart from './pages/cart/Cart';
import Dashboard from './pages/admin/dashboard/Dashboard';
import NoPage from './pages/nopage/NoPage';
import MyState from './context/data/myState';
import Login from './pages/registration/Login';
import Signup from './pages/registration/Signup';
import ProductInfo from './pages/productInfo/ProductInfo';
import AddProduct from './pages/admin/pages/AddProduct';
import UpdateProduct from './pages/admin/pages/UpdateProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allproducts from './pages/allproducts/AllProducts';
import Wishlist from './pages/cart/Wishlist';


function App() {
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path='/order' element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          } />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist/>} /> {/* Add Wishlist route */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/productinfo/:id' element={<ProductInfo />} />
          <Route path='/addproduct' element={
            <ProtectedRouteforadmin>
              <AddProduct />
            </ProtectedRouteforadmin>
          } />
          <Route path='/updateproduct' element={
            <ProtectedRouteforadmin>
              <UpdateProduct />
            </ProtectedRouteforadmin>
          } />
          <Route path='/*' element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </MyState>
  );
}

export default App;

// User side login
export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (user) {
    return children;
  } else {
    return <Navigate to={'/login'} />;
  }
}

// Admin side login
export const ProtectedRouteforadmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('user'));
  if (admin?.user?.email === 'admin011@gmail.com') {
    return children;
  } else {
    return <Navigate to={'/login'} />;
  }
}
