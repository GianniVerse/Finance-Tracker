const categoryMap = {
    "Food": ["Eating Out", "Groceries", "Snacks", "Restaurants"],
    "Entertainment": ["Movies", "Games", "Concerts", "Other"],
    "Clothes": ["Shirts", "Pants", "Shoes", "Accessories"],
    "Car": ["Fuel", "Rego", "Repair", "Tires", "Other"],
    "Experiences": ["Travel", "Events", "Workshops", "Other"],
    "Bills": ["Gas", "Electricity", "Internet", "Water", "Rent"]
};

const mainCategories = Object.keys(categoryMap);
let expenses = [];
let totalBudget = 0;
let editingExpenseId = null;

// DOM elements
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const mainCategorySelect = document.getElementById('mainCategory');
const subCategorySelect = document.getElementById('subCategory');
const expenseDateInput = document.getElementById('expenseDate');
const addBtn = document.getElementById('addBtn');
const expenseTable = document.getElementById('expenseTable').querySelector("tbody");
const totalSpan = document.getElementById('total');
const categoryTotalsTable = document.getElementById("categoryTotals").querySelector("tbody");

const budgetOverlay = document.getElementById('budgetOverlay');
const initialBudgetInput = document.getElementById('initialBudget');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const budgetDisplay = document.getElementById('budgetDisplay');
const budgetProgress = document.getElementById('budgetProgress');

const overBudgetOverlay = document.getElementById('overBudgetOverlay');
const overBudgetOkBtn = document.getElementById('overBudgetOkBtn');
overBudgetOkBtn.addEventListener('click', () => overBudgetOverlay.style.display = 'none');

// Populate main category dropdown
mainCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    mainCategorySelect.appendChild(option);
});

// Update subcategories dropdown
function updateSubCategories() {
    const selectedMain = mainCategorySelect.value;
    const subs = categoryMap[selectedMain];
    subCategorySelect.innerHTML = "";
    subs.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subCategorySelect.appendChild(option);
    });
}

updateSubCategories();
mainCategorySelect.addEventListener('change', updateSubCategories);

// Add or update expense
addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    let amount = Number(amountInput.value);
    amount = Math.round(amount * 100) / 100;
    const mainCat = mainCategorySelect.value;
    const subCat = subCategorySelect.value;
    const date = expenseDateInput.value;

    if (name === "" || amount <= 0 || date === "") return;

    if (editingExpenseId) {
        // Update existing expense
        const expenseIndex = expenses.findIndex(exp => exp.id === editingExpenseId);
        expenses[expenseIndex] = { id: editingExpenseId, name, amount, mainCat, subCat, date };

        // Reset edit mode
        editingExpenseId = null;
        addBtn.textContent = "Add Expense";
    } else {
        // Add new expense
        expenses.push({ id: Date.now(), name, amount, mainCat, subCat, date });
    }

    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    mainCategorySelect.value = mainCategories[0];
    updateSubCategories();

    // Re-render the table
    render();
});

// Set initial budget
setBudgetBtn.addEventListener('click', () => {
    const budget = Number(initialBudgetInput.value);
    if (budget <= 0) return alert("Enter a valid budget.");
    totalBudget = Math.round(budget * 100) / 100;
    updateBudgetDisplay();
    budgetOverlay.style.display = 'none';
});

// Render the expense table and update budget display
function render() {
    expenseTable.innerHTML = "";
    expenses.forEach(expense => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.mainCat}</td>
            <td>${expense.subCat}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="editExpense(${expense.id})">Edit</button>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;

        expenseTable.appendChild(tr);
    });

    // Update total amount
    updateTotal();
    updateCategoryTotals();
    updateBudgetDisplay();
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        // Populate input fields with current expense values
        nameInput.value = expense.name;
        amountInput.value = expense.amount;
        expenseDateInput.value = expense.date;
        mainCategorySelect.value = expense.mainCat;
        updateSubCategories();
        subCategorySelect.value = expense.subCat;

        // Change button to "Save Expense"
        addBtn.textContent = "Save Expense";
        editingExpenseId = expense.id;
    }
}

// Delete expense
function deleteExpense(id) {
    const index = expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
        expenses.splice(index, 1);
        render(); // Re-render the table after deletion
    }
}

// Update the total expenses
function updateTotal() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalSpan.textContent = total.toFixed(2);
}

// Update category totals
function updateCategoryTotals() {
    const totals = {};
    expenses.forEach(e => {
        totals[e.mainCat] = (totals[e.mainCat] || 0) + e.amount;
    });
    const totalsArray = Object.entries(totals).filter(([cat, amount]) => amount > 0).sort((a, b) => b[1] - a[1]);
    categoryTotalsTable.innerHTML = "";
    totalsArray.forEach(([cat, amount]) => {
        const row = document.createElement("tr");
        const categoryCell = document.createElement("td");
        categoryCell.textContent = cat;
        const totalCell = document.createElement("td");
        totalCell.textContent = amount.toFixed(2);
        row.appendChild(categoryCell);
        row.appendChild(totalCell);
        categoryTotalsTable.appendChild(row);
    });
}

// Update the budget display (remaining budget and progress bar)
function updateBudgetDisplay() {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalExpenses;
    const remainingFormatted = remaining.toFixed(2);

    // Update remaining budget display
    budgetDisplay.textContent = `Budget: $${remainingFormatted}`;

    // Remove previous budget color classes
    budgetDisplay.classList.remove('budget-green', 'budget-orange', 'budget-red');
    budgetProgress.style.background = '';  // Reset progress bar color

    // Progress bar fill (percentage spent)
    let percentSpent = totalExpenses / totalBudget * 100;
    if (percentSpent > 100) percentSpent = 100;  // Cap at 100%
    budgetProgress.style.width = `${percentSpent}%`;

    // Determine color of the budget display
    if (remaining < 0) {
        budgetDisplay.classList.add('budget-red');
        budgetProgress.style.background = 'red';
        overBudgetOverlay.style.display = 'flex';
    } else if (remaining === 0) {
        budgetDisplay.classList.add('budget-red');
        budgetProgress.style.background = 'red';
    } else if (remaining / totalBudget <= 0.2) {
        budgetDisplay.classList.add('budget-red');
        budgetProgress.style.background = 'red';
    } else if (remaining / totalBudget <= 0.5) {
        budgetDisplay.classList.add('budget-orange');
        budgetProgress.style.background = 'orange';
    } else {
        budgetDisplay.classList.add('budget-green');
        budgetProgress.style.background = 'green';
    }
}

// File upload functionality (for .txt files)
const uploadFile = document.getElementById('uploadFile');
uploadFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Assuming each expense is in a line in the format:
            // name|amount|mainCat|subCat|date
            const lines = e.target.result.split('\n');
            expenses = lines.map(line => {
                const [name, amount, mainCat, subCat, date] = line.split('|');
                return { name, amount: parseFloat(amount), mainCat, subCat, date };
            });
            render();
        } catch (error) {
            alert("Failed to load file.");
        }
    };
    reader.readAsText(file);
});
// File download functionality (for .txt files)
const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', function() {
    // Convert the expenses array into a plain text format
    const dataStr = expenses.map(exp => 
        `${exp.name}|${exp.amount.toFixed(2)}|${exp.mainCat}|${exp.subCat}|${exp.date}`
    ).join('\n');

    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.txt';
    a.click();
    URL.revokeObjectURL(url);
});
// DOM Elements
const faqBtn = document.getElementById('faqBtn');
const faqModal = document.getElementById('faqModal');
const closeFaqBtn = document.getElementById('closeFaqBtn');
const faqIframe = document.getElementById('faqIframe');

// Open FAQ Modal and load iframe
faqBtn.addEventListener('click', function() {
    faqModal.style.display = 'flex'; // Show modal
    faqIframe.src = 'finance-ai/faq.html'; // Load the FAQ page into the iframe
});

// Close FAQ Modal
closeFaqBtn.addEventListener('click', function() {
    faqModal.style.display = 'none'; // Hide modal
    faqIframe.src = ''; // Clear the iframe content when closing
});
