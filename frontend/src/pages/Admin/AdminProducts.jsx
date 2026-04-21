import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminProducts.css";
import { productAPI } from "../../services/api";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isBestSeller: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ limit: 100 });
      setProducts(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        alert("Product updated successfully!");
      } else {
        await api.post("/products", formData);
        alert("Product created successfully!");
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isBestSeller: false,
      });
      setShowForm(false);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      isBestSeller: product.isBestSeller || false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      isBestSeller: false,
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="products-header">
          <h2 className="page-title">Products Management</h2>
          <button
            className="btn-add-product"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "➕ Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="product-form-container">
            <form onSubmit={handleSubmit} className="product-form">
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter product description"
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="living-room">Living Room</option>
                    <option value="travel">Travel</option>
                    <option value="kids">Kids</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="Enter image URL"
                  required
                />
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleFormChange}
                  id="isBestSeller"
                />
                <label htmlFor="isBestSeller">Mark as Best Seller</label>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Best Seller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <div className="product-name">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumb"
                          />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className="price">${product.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.isBestSeller ? "badge-success" : "badge-secondary"
                        }`}
                      >
                        {product.isBestSeller ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
