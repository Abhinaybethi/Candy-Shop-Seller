// State management & LocalStorage initialization
const STORAGE_KEY = "expenses";
let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements
const expenseForm = document.getElementById("expenseForm");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseDateInput = document.getElementById("expenseDate");
const expenseList = document.getElementById("expenseList");
const totalAmountDisplay = document.getElementById("totalAmount");
const navTotalAmountDisplay = document.getElementById("navTotalAmount");
const expenseCountDisplay = document.getElementById("expenseCount");
const emptyState = document.getElementById("emptyState");
const expenseTable = document.getElementById("expenseTable");
const clearAllBtn = document.getElementById("clearAllBtn");

// Set default date input to today
function resetDateToToday() {
    const today = new Date().toISOString().split("T")[0];
    expenseDateInput.value = today;
}

// Category badge color mapping
const categoryBadges = {
    "Food & Dining": "bg-warning text-dark",
    "Transportation": "bg-info text-dark",
    "Shopping": "bg-primary text-white",
    "Utilities & Bills": "bg-danger text-white",
    "Entertainment": "bg-dark text-white",
    "Health": "bg-success text-white",
    "Other": "bg-secondary text-white"
};

// Currency formatter
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Persist data to LocalStorage
function saveExpenses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// Calculate total expense amount
function calculateTotal() {
    return expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
}

// Render table rows, counters, and toggle empty state
function renderExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        emptyState.style.display = "block";
        expenseTable.style.display = "none";
        clearAllBtn.style.display = "none";
    } else {
        emptyState.style.display = "none";
        expenseTable.style.display = "table";
        clearAllBtn.style.display = "inline-block";

        expenses.forEach((expense) => {
            const badgeClass = categoryBadges[expense.category] || "bg-secondary text-white";
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="ps-4 fw-semibold text-dark">${escapeHtml(expense.name)}</td>
                <td><span class="badge ${badgeClass} rounded-pill px-2 py-1">${escapeHtml(expense.category)}</span></td>
                <td class="text-muted small">${expense.date}</td>
                <td class="text-end fw-bold text-dark">${formatCurrency(expense.amount)}</td>
                <td class="text-center pe-4">
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteExpense('${expense.id}')" title="Delete expense">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    // Update totals and counters
    const total = calculateTotal();
    const formattedTotal = formatCurrency(total);
    totalAmountDisplay.textContent = formattedTotal;
    navTotalAmountDisplay.textContent = formattedTotal;
    expenseCountDisplay.textContent = expenses.length.toString();
}

// Capture form submission
expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    const date = expenseDateInput.value;

    if (!name || isNaN(amount) || amount <= 0 || !date) {
        alert("Please provide valid expense details.");
        return;
    }

    const newExpense = {
        id: Date.now().toString(),
        name,
        amount,
        category,
        date
    };

    // Prepend to show newest at the top
    expenses.unshift(newExpense);
    saveExpenses();
    renderExpenses();

    // Reset form
    expenseForm.reset();
    resetDateToToday();
    expenseNameInput.focus();
});

// Delete individual expense
window.deleteExpense = function (id) {
    expenses = expenses.filter(item => item.id !== id);
    saveExpenses();
    renderExpenses();
};

// Clear all expenses
clearAllBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all expenses?")) {
        expenses = [];
        saveExpenses();
        renderExpenses();
    }
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    resetDateToToday();
    renderExpenses();
});
