
import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaImage,
  FaBoxOpen,
} from "react-icons/fa";

import { useProducts } from "../../Context/ProductContext";
import "./Admin.css";

const emptyForm = {
  name: "",
  category: "Rings",
  material: "Gold",
  price: "",
  oldPrice: "",
  description: "",
  image: "",
  featured: false,
  newArrival: true,
};

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFileName, setImageFileName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const categories = ["Rings", "Necklaces", "Earrings", "Bracelets"];
  const materials = ["Gold", "Silver", "Diamond", "Pearl"];

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        `${product.name} ${product.category} ${product.material}`
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setImageFileName("");
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "Rings",
      material: product.material || "Gold",
      price: String(product.price ?? ""),
      oldPrice: String(product.oldPrice ?? ""),
      description: product.description || "",
      image: product.image || "",
      featured: Boolean(product.featured),
      newArrival: Boolean(product.newArrival),
    });
    setImageFileName("");
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: String(reader.result),
      }));
      setImageFileName(file.name);
      setError("");
    };

    reader.onerror = () => {
      setError("The image could not be read. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const price = Number(form.price);
    const oldPrice =
      form.oldPrice.trim() === ""
        ? price
        : Number(form.oldPrice);

    if (!form.name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price greater than zero.");
      return;
    }

    if (!Number.isFinite(oldPrice) || oldPrice < price) {
      setError("The original price must be equal to or greater than the selling price.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category,
      material: form.material,
      price,
      oldPrice,
      description: form.description.trim(),
      image: form.image.trim(),
      featured: form.featured,
      newArrival: form.newArrival,
    };

    try {
      if (editingId !== null) {
        updateProduct(editingId, productData);
        setNotice("Product updated successfully.");
      } else {
        addProduct(productData);
        setNotice("Product added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      setImageFileName("");
    } catch (err) {
      setError("Unable to save the product. Please try again.");
    }
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" from the catalogue? This cannot be undone.`
    );

    if (!confirmed) return;

    deleteProduct(product.id);
    setNotice(`${product.name} was deleted.`);
    setError("");
  };

  return (
    <div className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CATALOGUE MANAGEMENT</p>
          <h1>Products</h1>
          <p className="admin-muted">
            Manage your jewellery collection and product details.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddForm}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {notice && (
        <div className="admin-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {error && !showForm && (
        <div className="admin-form-error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-products-toolbar">
        <label className="admin-product-search">
          <FaSearch />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <span className="admin-products-count">
          {filteredProducts.length} products
        </span>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Material</th>
                <th>Price</th>
                <th>Original Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <div className="admin-product-thumb">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <FaImage />
                        )}
                      </div>

                      <div className="admin-product-name">
                        <strong>{product.name}</strong>
                        <span>
                          {product.featured ? "Featured" : "Standard"}
                          {product.newArrival ? " · New arrival" : ""}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>
                  <td>{product.material}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{formatPrice(product.oldPrice)}</td>

                  <td>
                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => openEditForm(product)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button danger"
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => handleDelete(product)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="admin-empty-state">
                      <FaBoxOpen className="admin-empty-icon" />
                      <h3>No products found</h3>
                      <p>
                        Try another search or add a new product.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="admin-product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-product-form-title"
          >
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">
                  {editingId !== null ? "EDIT CATALOGUE" : "NEW CATALOGUE ITEM"}
                </p>
                <h2 id="admin-product-form-title">
                  {editingId !== null ? "Edit Product" : "Add Product"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-icon-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <FaTimes />
              </button>
            </div>

            {error && (
              <div className="admin-form-error" role="alert">
                {error}
              </div>
            )}

            <form className="admin-product-form" onSubmit={handleSubmit}>
              <label className="admin-form-full">
                Product Name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Classic Gold Ring"
                  required
                />
              </label>

              <label>
                Category *
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Material *
                <select
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  required
                >
                  {materials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Selling Price (₹) *
                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2499"
                  required
                />
              </label>

              <label>
                Original Price (₹)
                <input
                  type="number"
                  name="oldPrice"
                  min="1"
                  step="1"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="2999"
                />
              </label>

              <label className="admin-form-full">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the piece..."
                />
              </label>

              <div className="admin-form-full">
                <label className="admin-upload-label">
                  Product Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                <label className="admin-image-url-label">
                  Or use an image URL
                  <input
                    type="url"
                    value={
                      form.image.startsWith("data:")
                        ? ""
                        : form.image
                    }
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        image: event.target.value,
                      }));
                      setImageFileName("");
                    }}
                    placeholder="https://example.com/product.jpg"
                  />
                </label>

                {imageFileName && (
                  <p className="admin-muted">
                    Selected: {imageFileName}
                  </p>
                )}

                {form.image && (
                  <div className="admin-image-preview">
                    <img src={form.image} alt="Product preview" />
                  </div>
                )}
              </div>

              <div className="admin-form-checkboxes admin-form-full">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  Featured product
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="newArrival"
                    checked={form.newArrival}
                    onChange={handleChange}
                  />
                  Mark as new arrival
                </label>
              </div>

              <div className="admin-form-actions admin-form-full">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
