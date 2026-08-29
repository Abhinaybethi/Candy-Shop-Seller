"use strict";

/* =========================================================
   CandyHub — Configuration
   =========================================================
   Evaluators: Replace API_BASE_URL with your active CRUD CRUD endpoint.
   Example: https://crudcrud.com/api/1afd1b4dfdf843dc8768c95b852e4230
   ========================================================= */

const API_BASE_URL = "https://crudcrud.com/api/e87e10f703da4220bbf9746df0e6b7fa";
const PRODUCTS_URL = `${API_BASE_URL}/products`;

/* =========================================================
   Application State
   ========================================================= */

let products = [];
let editingProductId = null;
let pendingDeleteProductId = null;

/* =========================================================
   DOM Elements Cache
   ========================================================= */

const elements = {
    // Dashboard Stats
    totalProducts: document.getElementById("totalProducts"),
    totalStock: document.getElementById("totalStock"),
    lowStock: document.getElementById("lowStock"),
    inventoryValue: document.getElementById("inventoryValue"),

    // Product Section States & Table
    tableWrapper: document.getElementById("tableWrapper"),
    productTableBody: document.getElementById("productTableBody"),
    loadingState: document.getElementById("loadingState"),
    emptyState: document.getElementById("emptyState"),
    noResultsState: document.getElementById("noResultsState"),

    // Toolbar
    searchInput: document.getElementById("searchInput"),
    categoryFilter: document.getElementById("categoryFilter"),
    clearFiltersButton: document.getElementById("clearFiltersButton"),

    // Add Buttons
    addProductButton: document.getElementById("addProductButton"),
    emptyAddButton: document.getElementById("emptyAddButton"),

    // Add/Edit Modal
    modalOverlay: document.getElementById("modalOverlay"),
    modalTitle: document.getElementById("modalTitle"),
    closeModal: document.getElementById("closeModal"),
    cancelButton: document.getElementById("cancelButton"),
    saveButton: document.getElementById("saveButton"),
    productForm: document.getElementById("productForm"),

    // Form Inputs & Error Messages
    productId: document.getElementById("productId"),
    productName: document.getElementById("productName"),
    productPrice: document.getElementById("productPrice"),
    productStock: document.getElementById("productStock"),
    productCategory: document.getElementById("productCategory"),
    productImage: document.getElementById("productImage"),
    nameError: document.getElementById("nameError"),
    priceError: document.getElementById("priceError"),
    stockError: document.getElementById("stockError"),
    categoryError: document.getElementById("categoryError"),
    imageError: document.getElementById("imageError"),

    // Image Preview Elements
    imagePreviewContainer: document.getElementById("imagePreviewContainer"),
    imagePreview: document.getElementById("imagePreview"),
    imagePreviewBadge: document.getElementById("imagePreviewBadge"),

    // Custom Delete Confirmation Modal
    deleteModalOverlay: document.getElementById("deleteModalOverlay"),
    deleteProductName: document.getElementById("deleteProductName"),
    closeDeleteModal: document.getElementById("closeDeleteModal"),
    cancelDeleteButton: document.getElementById("cancelDeleteButton"),
    confirmDeleteButton: document.getElementById("confirmDeleteButton"),

    // Notifications
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toastIcon"),
    toastMessage: document.getElementById("toastMessage")
};

/* =========================================================
   API Layer Helper
   ========================================================= */

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    // If the response is not OK, try to extract the server's error message
    if (!response.ok) {
        let errorMsg = `API Error ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (e) {
            // Response wasn't JSON, just use status
        }
        throw new Error(errorMsg);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

/* =========================================================
   CRUD Operations
   ========================================================= */

// READ: Fetch all products from CRUD CRUD
async function fetchProducts() {
    setLoadingState(true);

    try {
        const data = await apiRequest(PRODUCTS_URL);
        products = Array.isArray(data) ? data : [];
        renderProducts();
        updateDashboardStats();
    } catch (error) {
        console.error("Failed to fetch products:", error);
        showToast(error.message || "Unable to load products. Check your API endpoint in script.js.", "error");
        products = [];
        renderProducts();
        updateDashboardStats();
    } finally {
        setLoadingState(false);
    }
}

// CREATE: Post new product
async function createProduct(productData) {
    setSaveButtonLoading(true);

    try {
        await apiRequest(PRODUCTS_URL, {
            method: "POST",
            body: JSON.stringify(productData)
        });

        closeProductModal();
        await fetchProducts();
        showToast("Product added successfully.", "success");
    } catch (error) {
        console.error("Failed to create product:", error);
        showToast(error.message || "Could not save product. Please try again.", "error");
    } finally {
        setSaveButtonLoading(false);
    }
}

// UPDATE: Put updated product by ID
async function updateProduct(productId, productData) {
    setSaveButtonLoading(true);

    try {
        await apiRequest(`${PRODUCTS_URL}/${productId}`, {
            method: "PUT",
            body: JSON.stringify(productData)
        });

        closeProductModal();
        await fetchProducts();
        showToast("Product updated successfully.", "success");
    } catch (error) {
        console.error("Failed to update product:", error);
        showToast(error.message || "Could not update product. Please try again.", "error");
    } finally {
        setSaveButtonLoading(false);
    }
}

// DELETE: Delete product by ID after modal confirmation
async function executeDeleteProduct() {
    if (!pendingDeleteProductId) return;

    setDeleteButtonLoading(true);

    try {
        await apiRequest(`${PRODUCTS_URL}/${pendingDeleteProductId}`, {
            method: "DELETE"
        });

        closeDeleteModal();
        await fetchProducts();
        showToast("Product deleted successfully.", "success");
    } catch (error) {
        console.error("Failed to delete product:", error);
        showToast(error.message || "Could not delete product. Please try again.", "error");
    } finally {
        setDeleteButtonLoading(false);
    }
}

/* =========================================================
   Rendering & Filtering Logic
   ========================================================= */

function getFilteredProducts() {
    const searchTerm = elements.searchInput.value.trim().toLowerCase();
    const selectedCategory = elements.categoryFilter.value;

    return products.filter(product => {
        const matchesSearch = !searchTerm || product.name?.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
}

function renderProducts() {
    const filteredProducts = getFilteredProducts();
    elements.productTableBody.innerHTML = "";

    // Case 1: Total products array is empty (No inventory)
    if (products.length === 0) {
        elements.tableWrapper.classList.add("hidden");
        elements.noResultsState.classList.add("hidden");
        elements.emptyState.classList.remove("hidden");
        return;
    }

    elements.emptyState.classList.add("hidden");

    // Case 2: Products exist, but active search/filter returned no results
    if (filteredProducts.length === 0) {
        elements.tableWrapper.classList.add("hidden");
        elements.noResultsState.classList.remove("hidden");
        return;
    }

    // Case 3: Display matching product rows
    elements.noResultsState.classList.add("hidden");
    elements.tableWrapper.classList.remove("hidden");

    filteredProducts.forEach(product => {
        const row = createProductRow(product);
        elements.productTableBody.appendChild(row);
    });
}

function createProductRow(product) {
    const row = document.createElement("tr");

    const stock = Number(product.stock) || 0;
    const price = Number(product.price) || 0;
    const status = getStockStatus(stock);
    const safeName = escapeHTML(product.name);
    const safeCategory = escapeHTML(product.category);

    const imageHtml = product.image
        ? `<img
            class="product-image"
            src="${escapeHTML(product.image)}"
            alt="${safeName}"
            loading="lazy"
            onerror="this.onerror=null; this.outerHTML='<div class=\\'product-placeholder\\'>🍬</div>';"
           >`
        : `<div class="product-placeholder" aria-hidden="true">🍬</div>`;

    row.innerHTML = `
        <td>
            <div class="product-cell">
                ${imageHtml}
                <div>
                    <div class="product-name">${safeName}</div>
                    <div class="product-id">#${escapeHTML(product._id || "new")}</div>
                </div>
            </div>
        </td>
        <td>
            <span class="category-text">${safeCategory}</span>
        </td>
        <td>
            <span class="price">₹${price.toLocaleString("en-IN")}</span>
        </td>
        <td>
            <span class="stock">${stock}</span>
        </td>
        <td>
            <span class="status ${status.className}">
                ${status.label}
            </span>
        </td>
        <td>
            <div class="actions">
                <button
                    class="action-button"
                    type="button"
                    title="Edit product"
                    aria-label="Edit ${safeName}"
                    data-action="edit"
                    data-id="${product._id}"
                >
                    ✎
                </button>
                <button
                    class="action-button delete"
                    type="button"
                    title="Delete product"
                    aria-label="Delete ${safeName}"
                    data-action="delete"
                    data-id="${product._id}"
                >
                    ×
                </button>
            </div>
        </td>
    `;

    return row;
}

/* =========================================================
   Dashboard Statistics Calculation
   ========================================================= */

function updateDashboardStats() {
    const totalProductsCount = products.length;

    const totalStockCount = products.reduce((acc, product) => {
        return acc + (Number(product.stock) || 0);
    }, 0);

    const lowStockCount = products.filter(product => {
        const stock = Number(product.stock) || 0;
        return stock > 0 && stock <= 10;
    }).length;

    const totalInventoryValue = products.reduce((acc, product) => {
        const price = Number(product.price) || 0;
        const stock = Number(product.stock) || 0;
        return acc + price * stock;
    }, 0);

    elements.totalProducts.textContent = totalProductsCount.toLocaleString("en-IN");
    elements.totalStock.textContent = totalStockCount.toLocaleString("en-IN");
    elements.lowStock.textContent = lowStockCount.toLocaleString("en-IN");
    elements.inventoryValue.textContent = `₹${totalInventoryValue.toLocaleString("en-IN")}`;
}

function getStockStatus(stock) {
    if (stock <= 0) {
        return { label: "Out of stock", className: "out-of-stock" };
    }
    if (stock <= 10) {
        return { label: "Low stock", className: "low-stock" };
    }
    return { label: "In stock", className: "in-stock" };
}

/* =========================================================
   Modal Handling (Add & Edit Product)
   ========================================================= */

function openAddModal() {
    editingProductId = null;
    clearFormValidation();

    elements.modalTitle.textContent = "Add Product";
    elements.saveButton.textContent = "Save Product";
    elements.productForm.reset();
    elements.productId.value = "";
    hideImagePreview();

    elements.modalOverlay.classList.remove("hidden");
    setTimeout(() => elements.productName.focus(), 50);
}

function openEditModal(productId) {
    const product = products.find(item => item._id === productId);
    if (!product) return;

    editingProductId = productId;
    clearFormValidation();

    elements.modalTitle.textContent = "Edit Product";
    elements.saveButton.textContent = "Update Product";

    elements.productId.value = product._id || "";
    elements.productName.value = product.name || "";
    elements.productPrice.value = product.price ?? "";
    elements.productStock.value = product.stock ?? "";
    elements.productCategory.value = product.category || "";
    elements.productImage.value = product.image || "";

    if (product.image) {
        updateImagePreview(product.image);
    } else {
        hideImagePreview();
    }

    elements.modalOverlay.classList.remove("hidden");
    setTimeout(() => elements.productName.focus(), 50);
}

function closeProductModal() {
    elements.modalOverlay.classList.add("hidden");
    elements.productForm.reset();
    clearFormValidation();
    hideImagePreview();
    editingProductId = null;
}

/* =========================================================
   Custom Delete Confirmation Modal
   ========================================================= */

function openDeleteModal(productId) {
    const product = products.find(item => item._id === productId);
    if (!product) return;

    pendingDeleteProductId = productId;
    elements.deleteProductName.textContent = `"${product.name}"`;
    elements.deleteModalOverlay.classList.remove("hidden");
    elements.confirmDeleteButton.focus();
}

function closeDeleteModal() {
    elements.deleteModalOverlay.classList.add("hidden");
    pendingDeleteProductId = null;
}

/* =========================================================
   Image Preview Logic
   ========================================================= */

function updateImagePreview(url) {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
        hideImagePreview();
        return;
    }

    elements.imagePreview.src = cleanUrl;
    elements.imagePreviewContainer.classList.remove("hidden");
    elements.imagePreviewBadge.textContent = "Preview";
    elements.imagePreviewBadge.style.background = "rgba(23, 23, 34, 0.75)";
}

function hideImagePreview() {
    elements.imagePreviewContainer.classList.add("hidden");
    elements.imagePreview.src = "";
}

// Image load failure error handler for preview modal
elements.imagePreview.addEventListener("error", () => {
    elements.imagePreviewBadge.textContent = "Invalid Image";
    elements.imagePreviewBadge.style.background = "rgba(217, 75, 91, 0.9)";
});

elements.productImage.addEventListener("input", (e) => {
    updateImagePreview(e.target.value);
});

/* =========================================================
   Form Validation & Submission
   ========================================================= */

function clearFormValidation() {
    [elements.productName, elements.productPrice, elements.productStock, elements.productCategory, elements.productImage].forEach(input => {
        if (input) input.classList.remove("invalid");
    });

    [elements.nameError, elements.priceError, elements.stockError, elements.categoryError, elements.imageError].forEach(span => {
        if (span) span.textContent = "";
    });
}

function getFormData() {
    return {
        name: elements.productName.value.trim(),
        price: Number(elements.productPrice.value),
        stock: Number(elements.productStock.value),
        category: elements.productCategory.value,
        image: elements.productImage.value.trim()
    };
}

function validateProduct(product) {
    clearFormValidation();
    let isValid = true;

    if (!product.name) {
        elements.productName.classList.add("invalid");
        elements.nameError.textContent = "Product name is required.";
        isValid = false;
    } else if (product.name.length < 2) {
        elements.productName.classList.add("invalid");
        elements.nameError.textContent = "Product name must be at least 2 characters.";
        isValid = false;
    }

    if (elements.productPrice.value === "" || !Number.isFinite(product.price) || product.price < 0) {
        elements.productPrice.classList.add("invalid");
        elements.priceError.textContent = "Enter a valid positive price.";
        isValid = false;
    }

    if (elements.productStock.value === "" || !Number.isInteger(product.stock) || product.stock < 0) {
        elements.productStock.classList.add("invalid");
        elements.stockError.textContent = "Stock must be a non-negative integer.";
        isValid = false;
    }

    if (!product.category) {
        elements.productCategory.classList.add("invalid");
        elements.categoryError.textContent = "Please select a category.";
        isValid = false;
    }

    if (product.image) {
        try {
            new URL(product.image);
        } catch {
            elements.productImage.classList.add("invalid");
            elements.imageError.textContent = "Enter a valid HTTP/HTTPS URL.";
            isValid = false;
        }
    }

    return isValid;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const productData = getFormData();

    if (!validateProduct(productData)) {
        return;
    }

    if (editingProductId) {
        await updateProduct(editingProductId, productData);
    } else {
        await createProduct(productData);
    }
}

/* =========================================================
   UI Loading States
   ========================================================= */

function setLoadingState(isLoading) {
    if (isLoading) {
        elements.loadingState.classList.remove("hidden");
        elements.tableWrapper.classList.add("hidden");
        elements.emptyState.classList.add("hidden");
        elements.noResultsState.classList.add("hidden");
    } else {
        elements.loadingState.classList.add("hidden");
    }
}

function setSaveButtonLoading(isLoading) {
    elements.saveButton.disabled = isLoading;
    elements.saveButton.textContent = isLoading
        ? (editingProductId ? "Updating..." : "Saving...")
        : (editingProductId ? "Update Product" : "Save Product");
}

function setDeleteButtonLoading(isLoading) {
    elements.confirmDeleteButton.disabled = isLoading;
    elements.confirmDeleteButton.textContent = isLoading ? "Deleting..." : "Delete Product";
}

/* =========================================================
   Toast Notification System
   ========================================================= */

let toastTimeout;

function showToast(message, type = "success") {
    clearTimeout(toastTimeout);
    elements.toastMessage.textContent = message;

    if (type === "error") {
        elements.toastIcon.textContent = "!";
        elements.toastIcon.style.background = "var(--danger)";
    } else {
        elements.toastIcon.textContent = "✓";
        elements.toastIcon.style.background = "var(--success)";
    }

    elements.toast.classList.remove("hidden");

    toastTimeout = setTimeout(() => {
        elements.toast.classList.add("hidden");
    }, 3500);
}

/* =========================================================
   Security & HTML Escaping Helper
   ========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   Event Listeners Setup
   ========================================================= */

// Add Product triggers
elements.addProductButton.addEventListener("click", openAddModal);
elements.emptyAddButton.addEventListener("click", openAddModal);

// Modal close triggers
elements.closeModal.addEventListener("click", closeProductModal);
elements.cancelButton.addEventListener("click", closeProductModal);
elements.productForm.addEventListener("submit", handleFormSubmit);

// Custom Delete Modal triggers
elements.closeDeleteModal.addEventListener("click", closeDeleteModal);
elements.cancelDeleteButton.addEventListener("click", closeDeleteModal);
elements.confirmDeleteButton.addEventListener("click", executeDeleteProduct);

// Search & Filtering
elements.searchInput.addEventListener("input", renderProducts);
elements.categoryFilter.addEventListener("change", renderProducts);
elements.clearFiltersButton.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.categoryFilter.value = "all";
    renderProducts();
});

// Product Table Actions (Delegated Edit & Delete)
elements.productTableBody.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const productId = button.dataset.id;

    if (action === "edit") {
        openEditModal(productId);
    } else if (action === "delete") {
        openDeleteModal(productId);
    }
});

// Backdrop click closes open modals
elements.modalOverlay.addEventListener("click", event => {
    if (event.target === elements.modalOverlay) {
        closeProductModal();
    }
});

elements.deleteModalOverlay.addEventListener("click", event => {
    if (event.target === elements.deleteModalOverlay) {
        closeDeleteModal();
    }
});

// Escape key closes open modals
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (!elements.modalOverlay.classList.contains("hidden")) {
            closeProductModal();
        } else if (!elements.deleteModalOverlay.classList.contains("hidden")) {
            closeDeleteModal();
        }
    }
});

/* =========================================================
   App Initialization
   ========================================================= */

fetchProducts();