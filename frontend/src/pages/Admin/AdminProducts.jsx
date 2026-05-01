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

const StockBadge = ({ stock }) => {
  if (stock === 0) return <span className="admin-stock-badge out">Out of Stock</span>;
  if (stock <= 10) return <span className="admin-stock-badge low">{stock} Low</span>;
  return <span className="admin-stock-badge in">{stock}</span>;
};

// ── helpers for JSON textarea fields ──
const toJson = (val) => {
  try { return JSON.stringify(JSON.parse(val), null, 2); }
  catch { return val; }
};

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  category: "",
  isBestSeller: false,
  // new fields
  material: "",
  pattern: "",
  fill: "",
  types: "",   // JSON string
  sizes: "",   // JSON string
  dispatchInfo: "",
  isCustomizable: false,
  klarnaEligible: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("basic"); // basic | variants | extra
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
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

  // ── DEBUG: log everything before sending ──
  console.log("formData:", formData);
  console.log("editingId:", editingId);

  for (const field of ['types', 'sizes']) {
    if (formData[field]) {
      try { JSON.parse(formData[field]); }
      catch { alert(`Invalid JSON in "${field}"`); return; }
    }
  }

  const payload = new FormData();
  payload.append("name",          formData.name);
  payload.append("description",   formData.description);
  payload.append("price",         formData.price);
  payload.append("discountPrice", formData.discountPrice);
  payload.append("stock",         formData.stock || 0);
  payload.append("category",      formData.category);
  payload.append("isBestSeller",  formData.isBestSeller);
  payload.append("material",      formData.material      || "");
  payload.append("pattern",       formData.pattern       || "");
  payload.append("fill",          formData.fill          || "");
  payload.append("dispatchInfo",  formData.dispatchInfo  || "");
  payload.append("isCustomizable",formData.isCustomizable);
  payload.append("klarnaEligible",formData.klarnaEligible);
  payload.append("types",         formData.types         || "[]");
  payload.append("sizes",         formData.sizes         || "[]");
  if (imageFile) payload.append("image", imageFile);

  // ── DEBUG: log FormData contents ──
  for (let [key, value] of payload.entries()) {
    console.log(`payload → ${key}:`, value);
  }

  try {
    let response;
    if (editingId) {
      response = await productAPI.update(editingId, payload);
    } else {
      response = await productAPI.create(payload);
    }
    // ── DEBUG: log response ──
    console.log("API response:", response.data);
    resetForm();
    fetchProducts();
  } catch (error) {
    console.error("Full error:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status:", error.response?.status);
    alert("Error: " + (error.response?.data?.message || error.message));
  }
};

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock ?? "",
      category: product.category,
      isBestSeller: product.isBestSeller || false,
      material: product.material || "",
      pattern: product.pattern || "",
      fill: product.fill || "",
      types: product.types ? JSON.stringify(product.types, null, 2) : "",
      sizes: product.sizes ? JSON.stringify(product.sizes, null, 2) : "",
      dispatchInfo: product.dispatchInfo || "",
      isCustomizable: product.isCustomizable || false,
      klarnaEligible: product.klarnaEligible || false,
    });
    setImageFile(null);
    setImagePreview(product.image ? getImageUrl(product.image) : null);
    setEditingId(product.id);
    setActiveTab("basic");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  const handleStockUpdate = async (product, newStock) => {
    const val = parseInt(newStock);
    if (isNaN(val) || val < 0) return;
    try {
      await productAPI.patch(product.id, { stock: val });
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, stock: val } : p)
      );
    } catch (error) {
      alert("Failed to update stock: " + (error.response?.data?.message || error.message));
    }
  };
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
    setEditingId(null);
    setActiveTab("basic");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const inStock = products.filter(p => p.stock > 10).length;

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

        {/* ── Stock stats ── */}
        <div className="admin-stock-stats">
          <div className="admin-stock-stat">
            <span className="admin-stock-stat__value">{products.length}</span>
            <span className="admin-stock-stat__label">Total Products</span>
          </div>
          <div className="admin-stock-stat admin-stock-stat--in">
            <span className="admin-stock-stat__value">{inStock}</span>
            <span className="admin-stock-stat__label">In Stock</span>
          </div>
          <div className="admin-stock-stat admin-stock-stat--low">
            <span className="admin-stock-stat__value">{lowStock}</span>
            <span className="admin-stock-stat__label">Low Stock (≤10)</span>
          </div>
          <div className="admin-stock-stat admin-stock-stat--out">
            <span className="admin-stock-stat__value">{outOfStock}</span>
            <span className="admin-stock-stat__label">Out of Stock</span>
          </div>
        </div>

        {/* ════════════════════════════════
            Product Form
        ════════════════════════════════ */}
        {showForm && (
          <div className="admin-product-form-container">
            <form onSubmit={handleSubmit} className="admin-product-form">
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

              {/* ── Tab switcher ── */}
              <div className="admin-form-tabs">
                {["basic", "variants", "extra"].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    className={`admin-form-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "basic" ? "📦 Basic Info" : null}
                    {tab === "variants" ? "🎛️ Variants" : null}
                    {tab === "extra" ? "⚙️ Extra" : null}
                  </button>
                ))}
              </div>

              {/* ══ TAB: Basic Info ══ */}
              {activeTab === "basic" && (
                <>
                  <div className="admin-form-group">
                    <label>Product Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter product name" required />
                  </div>

                  <div className="admin-form-group">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Enter product description" rows="4" required />
                  </div>

                  <div className="admin-form-row admin-form-row--4">
                    <div className="admin-form-group">
                      <label>Price *</label>
                      <input type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} placeholder="0.00" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Discount Price</label>
                      <input type="number" step="0.01" name="discountPrice" value={formData.discountPrice} onChange={handleFormChange} placeholder="0.00 (optional)" />
                    </div>
                    <div className="admin-form-group">
                      <label>Stock *</label>
                      <input type="number" min="0" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="0" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Category *</label>
                      <select name="category" value={formData.category} onChange={handleFormChange} required>
                        <option value="">Select Category</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="living-room">Living Room</option>
                        <option value="travel">Travel</option>
                        <option value="kids">Kids</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter attributes */}
                  <div className="admin-form-row admin-form-row--3">
                    <div className="admin-form-group">
                      <label>Material</label>
                      <select name="material" value={formData.material} onChange={handleFormChange}>
                        <option value="">None</option>
                        {["Cotton", "Wool", "Fleece", "Down", "Polyester", "Silk", "Cashmere"].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Pattern</label>
                      <select name="pattern" value={formData.pattern} onChange={handleFormChange}>
                        <option value="">None</option>
                        {["Solid", "Striped", "Plaid", "Geometric", "Floral"].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Fill</label>
                      <select name="fill" value={formData.fill} onChange={handleFormChange}>
                        <option value="">None</option>
                        {["Goose Down", "Duck Down", "Synthetic", "Wool", "Cotton", "SpiderMan", "Plain"].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Product Image {!editingId && "*"}</label>
                    <div className="admin-image-upload-area">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="admin-image-file-input" id="imageUpload" required={!editingId} />
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
                    <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleFormChange} id="isBestSeller" />
                    <label htmlFor="isBestSeller">Mark as Best Seller</label>
                  </div>
                </>
              )}

              {/* ══ TAB: Variants ══ */}
              {activeTab === "variants" && (
                <>
                  <div className="admin-form-group">
                    <label>Types (JSON array)</label>
                    <p className="admin-form-hint">e.g. <code>{`[{"label":"Fleece","value":"fleece"},{"label":"Sherpa fleece","value":"sherpa"}]`}</code></p>
                    <textarea
                      name="types"
                      value={formData.types}
                      onChange={handleFormChange}
                      placeholder='[{"label":"Fleece","value":"fleece"}]'
                      rows="5"
                      className="admin-json-textarea"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Sizes (JSON array)</label>
                    <p className="admin-form-hint">e.g. <code>{`[{"label":"Small","dimensions":"48cm*78cm","price":"12.99","discountPrice":"9.99"}]`}</code></p>
                    <textarea
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleFormChange}
                      placeholder='[{"label":"Small","dimensions":"48cm*78cm","price":"12.99","discountPrice":null}]'
                      rows="8"
                      className="admin-json-textarea"
                    />
                  </div>
                </>
              )}

              {/* ══ TAB: Extra ══ */}
              {activeTab === "extra" && (
                <>
                  <div className="admin-form-group">
                    <label>Dispatch Info</label>
                    <textarea
                      name="dispatchInfo"
                      value={formData.dispatchInfo}
                      onChange={handleFormChange}
                      placeholder="e.g. Dispatched within 2–3 business days"
                      rows="3"
                    />
                  </div>

                  <div className="admin-form-group checkbox">
                    <input type="checkbox" name="isCustomizable" checked={formData.isCustomizable} onChange={handleFormChange} id="isCustomizable" />
                    <label htmlFor="isCustomizable">Product is Customizable (shows "Customize blanket" button)</label>
                  </div>

                  <div className="admin-form-group checkbox">
                    <input type="checkbox" name="klarnaEligible" checked={formData.klarnaEligible} onChange={handleFormChange} id="klarnaEligible" />
                    <label htmlFor="klarnaEligible">Klarna Eligible (shows "Klarna available at checkout")</label>
                  </div>
                </>
              )}

              <div className="admin-form-buttons">
                <button type="submit" className="admin-btn-submit">{editingId ? "Update Product" : "Create Product"}</button>
                <button type="button" className="admin-btn-cancel" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Search ── */}
        <div className="admin-products-search">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* ── Table ── */}
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
                  <th>Material</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Best Seller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={product.stock === 0 ? 'admin-row-out' : product.stock <= 10 ? 'admin-row-low' : ''}>
                    <td>{product.id}</td>
                    <td>
                      <div className="admin-product-name">
                        {product.image && (
                          <img src={getImageUrl(product.image)} alt={product.name} className="admin-product-thumb" onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      {product.material
                        ? <span className="admin-badge admin-badge-secondary">{product.material}</span>
                        : <span className="admin-badge admin-badge-secondary">—</span>
                      }
                    </td>
                    <td className="admin-price">£{product.price}</td>
                    <td className="admin-price">
                      {product.discountPrice
                        ? `£${product.discountPrice}`
                        : <span className="admin-badge admin-badge-secondary">None</span>
                      }
                    </td>
                    <td>
                      <div className="admin-stock-cell">
                        <StockBadge stock={product.stock} />
                        <div className="admin-stock-editor">
                          <button className="admin-stock-btn" onClick={() => handleStockUpdate(product, product.stock - 1)} disabled={product.stock === 0}>−</button>
                          <input
                            className="admin-stock-input"
                            type="number"
                            min="0"
                            value={product.stock}
                            onChange={(e) => handleStockUpdate(product, e.target.value)}
                          />
                          <button className="admin-stock-btn" onClick={() => handleStockUpdate(product, product.stock + 1)}>+</button>
                        </div>
                      </div>
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