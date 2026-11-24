
let budget = Number(localStorage.getItem("budget")) || 0;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const budgetDisplay = document.getElementById("budget");
const totalDisplay = document.getElementById("total");
const balanceDisplay = document.getElementById("balance");
const expenseList = document.getElementById("expenseList");
const expenseForm = document.getElementById("expenseForm");

// Format amounts in Indian Rupees
function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// Set monthly budget
function setBudget() {
    const input = document.getElementById("budgetInput");
    const newBudget = Number(input.value);

    if (newBudget <= 0 || input.value === "") {
        alert("Please enter a valid budget!");
        return;
    }

    budget = newBudget;
    localStorage.setItem("budget", budget);

    input.value = "";
    updateDashboard();
}

// Add a new expense
expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!title || amount <= 0 || !category || !date) {
        alert("Please fill in all fields correctly!");
        return;
    }

    const expense = {
        id: Date.now(),
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    expenseForm.reset();
    updateDashboard();
});

// Delete an expense
function deleteExpense(id) {
    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateDashboard();
}

// Update dashboard and expense table
function updateDashboard() {
    const totalSpent = expenses.reduce(function(total, expense) {
        return total + expense.amount;
    }, 0);

    budgetDisplay.textContent = formatMoney(budget);
    totalDisplay.textContent = formatMoney(totalSpent);
    balanceDisplay.textContent = formatMoney(budget - totalSpent);

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No expenses added yet.
                </td>
            </tr>
        `;
        return;
    }

    expenses.slice().reverse().forEach(function(expense) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(expense.title)}</td>
            <td>${escapeHTML(expense.category)}</td>
            <td>${formatMoney(expense.amount)}</td>
            <td>${escapeHTML(expense.date)}</td>
            <td>
                <button class="delete-btn"
                onclick="deleteExpense(${expense.id})">
                Delete
                </button>
            </td>
        `;

        expenseList.appendChild(row);
    });
}

// Prevent user-entered text from being treated as HTML
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function(character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return replacements[character];
    });
}

// Load saved information when page opens
updateDashboard();
