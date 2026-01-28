import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import AddCategory from "./pages/AddCategory";
import ManageCategories from "./pages/ManageCategories";
import EditProduct from "./pages/EditProduct";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";   // ✅ ADDED

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- DASHBOARD ---------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ---------- PRODUCT DETAILS ---------- */}
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
      />

      {/* ---------- USER CART ---------- */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute userOnly>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* ---------- CHECKOUT ---------- */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute userOnly>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* ---------- ORDER SUCCESS ---------- */}
      <Route
        path="/order-success"
        element={
          <ProtectedRoute userOnly>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      {/* ✅ MY ORDERS (ORDER HISTORY) */}
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute userOnly>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* ---------- PROFILE ---------- */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route
        path="/add-product"
        element={
          <ProtectedRoute adminOnly>
            <AddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-category"
        element={
          <ProtectedRoute adminOnly>
            <AddCategory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-categories"
        element={
          <ProtectedRoute adminOnly>
            <ManageCategories />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditProduct />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
