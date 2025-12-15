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

// Add expense
addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    let amount = Number(amountInput.value);
    amount = Math.round(amount * 100) / 100;
    const mainCat = mainCategorySelect.value;
    const subCat = subCategorySelect.value;
    const date = expenseDateInput.value;

    if (name === "" || amount <= 0 || date === "") return;

    expenses.push({ id: Date.now(), name, amount, mainCat, subCat, date });

    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    mainCategorySelect.value = mainCategories[0];
    updateSubCategories();

    // Re-render the table and update budget progress
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
            <td><button onclick="editExpense(${expense.id})">Edit</button></td>
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
    // Implement edit functionality
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
