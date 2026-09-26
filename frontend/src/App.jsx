import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5004/products";

function App() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
    image: "",
  });

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
      category: form.category,
      image: form.image,
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, productData);
      } else {
        await axios.post(API_URL, productData);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      quantity: product.quantity || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      quantity: "",
      price: "",
      category: "",
      image: "",
    });
  };
    const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;

  const totalValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0
  );

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const lowStock = products.filter(
    (product) => Number(product.quantity) < 10
  ).length;

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            📦
          </div>

          <div>
            <h2>StockPro</h2>
            <span>Inventory System</span>
          </div>

        </div>

        <nav className="navigation">

          <div className="nav-item active">
            <span>📊</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>📦</span>
            Products
          </div>

          <div className="nav-item">
            <span>🗂️</span>
            Categories
          </div>

          <div className="nav-item">
            <span>📈</span>
            Reports
          </div>

          <div className="nav-item">
            <span>⚙️</span>
            Settings
          </div>

        </nav>

        <div className="sidebar-profile">

          <div className="profile-avatar">
            A
          </div>

          <div>
            <strong>Admin</strong>
            <small>Administrator</small>
          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main">

        {/* HEADER */}

        <header className="topbar">

          <div>

            <h1>Inventory Dashboard</h1>

            <p>
              Manage your products and inventory efficiently.
            </p>

          </div>

          <div className="top-right">

            <button className="notification">
              🔔
            </button>

            <div className="admin">

              <div className="admin-avatar">
                A
              </div>

              <span>Admin</span>

            </div>

          </div>

        </header>


        {/* STAT CARDS */}

        <section className="stats">

          <div className="stat-card blue">

            <div>

              <p>Total Products</p>

              <h2>{totalProducts}</h2>

              <span>
                Products in inventory
              </span>

            </div>

            <div className="stat-icon">
              📦
            </div>

          </div>


          <div className="stat-card purple">

            <div>

              <p>Inventory Value</p>

              <h2>
                ₹{totalValue.toLocaleString()}
              </h2>

              <span>
                Current stock value
              </span>

            </div>

            <div className="stat-icon">
              💰
            </div>

          </div>


          <div className="stat-card green">

            <div>

              <p>Categories</p>

              <h2>{totalCategories}</h2>

              <span>
                Product categories
              </span>

            </div>

            <div className="stat-icon">
              🗂️
            </div>

          </div>


          <div className="stat-card orange">

            <div>

              <p>Low Stock</p>

              <h2>{lowStock}</h2>

              <span>
                Needs attention
              </span>

            </div>

            <div className="stat-icon">
              ⚠️
            </div>

          </div>

        </section>
          {/* ADD PRODUCT */}

        <section className="panel">

          <div className="panel-title">

            <div>

              <h2>
                {editingId
                  ? "Update Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingId
                  ? "Update the product information below"
                  : "Enter product details to add a new product"}
              </p>

            </div>

            <div className="title-icon">
              {editingId ? "✏️" : "＋"}
            </div>

          </div>


          <form
            className="product-form"
            onSubmit={handleSubmit}
          >

            {/* Product Name */}

            <div className="input-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Quantity */}

            <div className="input-group">

              <label>
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                placeholder="0"
                value={form.quantity}
                onChange={handleChange}
                required
              />

            </div>


            {/* Price */}

            <div className="input-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="₹ 0"
                value={form.price}
                onChange={handleChange}
                required
              />

            </div>


            {/* Category */}

            <div className="input-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                placeholder="Laptops, Headphones..."
                value={form.category}
                onChange={handleChange}
                required
              />

            </div>


            {/* Image URL */}

            <div className="input-group full">

              <label>
                Product Image URL
              </label>

              <input
                type="text"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={handleChange}
              />

            </div>


            {/* BUTTONS */}

            <div className="form-buttons">

              {editingId && (

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

              <button
                type="submit"
                className="add-btn"
              >
                {editingId
                  ? "Update Product"
                  : "＋ Add Product"}
              </button>

            </div>

          </form>

        </section>


        {/* PRODUCTS SECTION */}

        <section className="panel">

          <div className="products-header">

            <div>

              <h2>
                Products
              </h2>

              <p>
                Manage all products in your inventory
              </p>

            </div>


            {/* SEARCH */}

            <div className="search-box">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* PRODUCT TABLE */}

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Total Value
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="empty"
                    >

                      <div className="empty-icon">
                        📦
                      </div>

                      <h3>
                        No Products Found
                      </h3>

                      <p>
                        Add your first product above.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredProducts.map((product) => (

                    <tr key={product.id}>

                      {/* PRODUCT */}

                      <td>

                        <div className="product-info">

                          {product.image ? (

                            <img
                              src={product.image}
                              alt={product.name}
                            />

                          ) : (

                            <div className="product-placeholder">
                              📦
                            </div>

                          )}

                          <strong>
                            {product.name}
                          </strong>

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="category">
                          {product.category}
                        </span>

                      </td>


                      {/* QUANTITY */}

                      <td>
                        {product.quantity}
                      </td>


                      {/* PRICE */}

                      <td>
                        ₹{product.price}
                      </td>


                      {/* TOTAL VALUE */}

                      <td>

                        <strong>
                          ₹
                          {(
                            Number(product.quantity) *
                            Number(product.price)
                          ).toLocaleString()}
                        </strong>

                      </td>


                      {/* STATUS */}

                      <td>

                        {Number(product.quantity) < 10 ? (

                          <span className="status low">
                            Low Stock
                          </span>

                        ) : (

                          <span className="status available">
                            Available
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="actions">

                          <button
                            className="edit"
                            onClick={() =>
                              handleEdit(product)
                            }
                          >
                            ✏️
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              handleDelete(product.id)
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>
          </main>

    </div>
  );
}

export default App;
          
