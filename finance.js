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

mainCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    mainCategorySelect.appendChild(option);
});

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

addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    let amount = Number(amountInput.value);
    amount = Math.round(amount * 100) / 100;
    const mainCat = mainCategorySelect.value;
    const subCat = subCategorySelect.value;
    const date = expenseDateInput.value;

    if (name === "" || amount <= 0 || date === "") return;

    if (editingExpenseId) {
        const expenseIndex = expenses.findIndex(exp => exp.id === editingExpenseId);
        expenses[expenseIndex] = { id: editingExpenseId, name, amount, mainCat, subCat, date };
        editingExpenseId = null;
        addBtn.textContent = "Add Expense";
    } else {
        expenses.push({ id: Date.now(), name, amount, mainCat, subCat, date });
    }

    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    mainCategorySelect.value = mainCategories[0];
    updateSubCategories();
    render();
});

setBudgetBtn.addEventListener('click', () => {
    const budget = Number(initialBudgetInput.value);
    if (budget <= 0) return alert("Enter a valid budget.");
    totalBudget = Math.round(budget * 100) / 100;
    updateBudgetDisplay();
    budgetOverlay.style.display = 'none';
});

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

    updateTotal();
    updateCategoryTotals();
    updateBudgetDisplay();
}

function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        nameInput.value = expense.name;
        amountInput.value = expense.amount;
        expenseDateInput.value = expense.date;
        mainCategorySelect.value = expense.mainCat;
        updateSubCategories();
        subCategorySelect.value = expense.subCat;
        addBtn.textContent = "Save Expense";
        editingExpenseId = expense.id;
    }
}

function deleteExpense(id) {
    const index = expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
        expenses.splice(index, 1);
        render();
    }
}

function updateTotal() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalSpan.textContent = total.toFixed(2);
}

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

function updateBudgetDisplay() {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalExpenses;
    const remainingFormatted = remaining.toFixed(2);

    budgetDisplay.textContent = `Budget: $${remainingFormatted}`;

    budgetDisplay.classList.remove('budget-green', 'budget-orange', 'budget-red');
    budgetProgress.style.background = '';

    let percentSpent = totalExpenses / totalBudget * 100;
    if (percentSpent > 100) percentSpent = 100;
    budgetProgress.style.width = `${percentSpent}%`;

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

const uploadFile = document.getElementById('uploadFile');
uploadFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
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

const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', function() {

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

const faqBtn = document.getElementById('faqBtn');
const faqModal = document.getElementById('faqModal');
const closeFaqBtn = document.getElementById('closeFaqBtn');
const faqIframe = document.getElementById('faqIframe');

faqBtn.addEventListener('click', function() {
    faqModal.style.display = 'flex';
    faqIframe.src = 'finance-ai/faq.html';
});

closeFaqBtn.addEventListener('click', function() {
    faqModal.style.display = 'none';
    faqIframe.src = '';
});
