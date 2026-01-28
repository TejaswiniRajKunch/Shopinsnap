import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs"; 

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  /* ================= LOGOUT ================= */
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => logout());

    api.get("/products/all")
      .then(res => {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);

        const uniqueCategories = [];
        const seen = new Set();

        res.data.products.forEach(p => {
          if (p.cat_id && !seen.has(p.cat_id)) {
            seen.add(p.cat_id);
            uniqueCategories.push({
              cat_id: p.cat_id,
              cat_name: p.cat_name
            });
          }
        });

        setCategories(uniqueCategories);
      });

    loadCart();
  }, []);

  /* ================= LOAD CART ================= */
  const loadCart = () => {
    api.get("/cart/my-cart")
      .then(res => setCartItems(res.data.cart))
      .catch(() => {});
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(p => p.cat_id === Number(selectedCategory));
    }

    if (search.trim()) {
      const text = search.toLowerCase();
      result = result.filter(
        p =>
          p.product_name.toLowerCase().includes(text) ||
          p.brand.toLowerCase().includes(text)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, search, products]);

  if (!user) return <div>Loading...</div>;

  const cartCount = cartItems.reduce((sum, i) => sum + i.no_of_items, 0);

  return (
    <div>

      {/* ================= TOP BAR ================= */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 25px",
        borderBottom: "2px solid #ddd",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>

        <h2 style={{ margin: 0 }}>Shop in Snap</h2>

        <div style={{ display: "flex", gap: 15 }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: 8, borderRadius: 5 }}
          >
            <option value="all">All Products</option>
            {categories.map(c => (
              <option key={c.cat_id} value={c.cat_id}>
                {c.cat_name}
              </option>
            ))}
          </select>

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: 8, borderRadius: 5, width: 220 }}
          />
        </div>

        <div style={{ display: "flex", gap: 20 }}>

          {/* CART */}
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 26, cursor: "pointer" }}
              onClick={() => {
                setCartOpen(!cartOpen);
                setProfileOpen(false);
              }}>
              🛒
            </div>

            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: -6,
                right: -8,
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: 12
              }}>
                {cartCount}
              </span>
            )}

            {cartOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: 35,
                width: 280,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 10
              }}>
                <b>My Cart</b>
                <hr />
                {cartItems.length === 0
                  ? <p>Cart is empty</p>
                  : cartItems.map(i => (
                    <div key={i.cart_id}>
                      {i.product_name} × {i.no_of_items}
                    </div>
                  ))
                }
                <button
                  style={{ marginTop: 10, width: "100%" }}
                  onClick={() => navigate("/cart")}
                >
                  View Cart
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 26, cursor: "pointer" }}
              onClick={() => {
                setProfileOpen(!profileOpen);
                setCartOpen(false);
              }}>
              👤
            </div>

            {profileOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: 35,
                width: 180,
                background: "#fff",
                border: "1px solid #ccc"
              }}>
                <MenuItem label="My Profile" onClick={() => navigate("/profile")} />
                <MenuItem label="My Orders" onClick={() => navigate("/my-orders")} />
                {role === "admin" && (
                  <>
                    <MenuItem label="Add Category" onClick={() => navigate("/add-category")} />
                    <MenuItem label="Manage Categories" onClick={() => navigate("/manage-categories")} />
                    <MenuItem label="Add Product" onClick={() => navigate("/add-product")} />
                  </>
                )}
                <MenuItem label="Logout" onClick={logout} danger />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ BREADCRUMBS */}
      <Breadcrumbs />

      {/* ================= PRODUCTS ================= */}
      <div style={{ padding: 20 }}>
        <h3>Available Products</h3>

        {filteredProducts.length === 0 ? (
          <p>No products found 😔</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 20
          }}>
            {filteredProducts.map(p => (
              <div
                key={p.product_id}
                onClick={() => navigate(`/product/${p.product_id}`)}
                style={{
                  border: "1px solid #ccc",
                  padding: 15,
                  borderRadius: 8,
                  cursor: "pointer"
                }}
              >
                <img
                  src={p.image_url || "https://via.placeholder.com/250"}
                  alt="Product"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
                <h3>{p.product_name}</h3>
                <p><b>Brand:</b> {p.brand}</p>
                <p><b>Price:</b> ₹{p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MENU ITEM ================= */
function MenuItem({ label, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 10,
        cursor: "pointer",
        color: danger ? "red" : "#000"
      }}
    >
      {label}
    </div>
  );
}
