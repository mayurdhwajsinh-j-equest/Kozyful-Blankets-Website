import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminProducts.css";
import { productAPI, BACKEND_URL } from "../../services/api";
import api from "../../services/api";

const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'placeholder.png') return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    isBestSeller: false,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("discountPrice", formData.discountPrice);
    payload.append("category", formData.category);
    payload.append("isBestSeller", formData.isBestSeller);
    if (imageFile) payload.append("image", imageFile);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        alert("Product updated successfully!");
      } else {
        await api.post("/products", payload);
        alert("Product created successfully!");
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      isBestSeller: product.isBestSeller || false,
    });
    setImageFile(null);
    setImagePreview(product.image ? getImageUrl(product.image) : null);
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

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", discountPrice: "", category: "", isBestSeller: false });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
    setEditingId(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="admin-products-header">
          <h2 className="admin-page-title">Products Management</h2>
          <button
            className="admin-btn-add-product"
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          >
            {showForm ? "✕ Cancel" : "➕ Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="admin-product-form-container">
            <form onSubmit={handleSubmit} className="admin-product-form">
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

              <div className="admin-form-group">
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

              <div className="admin-form-group">
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

              {/* ── Price / Discount Price / Category ── */}
              <div className="admin-form-row admin-form-row--3">
                <div className="admin-form-group">
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

                <div className="admin-form-group">
                  <label>Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleFormChange}
                    placeholder="Enter discount price (optional)"
                  />
                </div>

                <div className="admin-form-group">
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

              {/* ── Image Upload ── */}
              <div className="admin-form-group">
                <label>Product Image {!editingId && "*"}</label>
                <div className="admin-image-upload-area">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="admin-image-file-input"
                    id="imageUpload"
                    required={!editingId}
                  />
                  <label htmlFor="imageUpload" className="admin-image-upload-label">
                    {imagePreview ? "🔄 Change Image" : "📂 Choose Image"}
                  </label>
                  {imageFile && <span className="admin-image-file-name">{imageFile.name}</span>}
                </div>
                {imagePreview && (
                  <div className="admin-image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="admin-form-group checkbox">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleFormChange}
                  id="isBestSeller"
                />
                <label htmlFor="isBestSeller">Mark as Best Seller</label>
              </div>

              <div className="admin-form-buttons">
                <button type="submit" className="admin-btn-submit">
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" className="admin-btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-products-search">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {loading ? (
          <div className="admin-products-loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-products-no-products">No products found</div>
        ) : (
          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Best Seller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <div className="admin-product-name">
                        {product.image && (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="admin-product-thumb"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className="admin-price">${product.price}</td>
                    <td className="admin-price">
                      {product.discountPrice ? `$${product.discountPrice}` : <span className="admin-badge admin-badge-secondary">None</span>}
                    </td>
                    <td>
                      <span className={`admin-badge ${product.isBestSeller ? "admin-badge-success" : "admin-badge-secondary"}`}>
                        {product.isBestSeller ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-buttons">
                        <button className="admin-btn-edit" onClick={() => handleEdit(product)}>✏️ Edit</button>
                        <button className="admin-btn-product-delete" onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
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