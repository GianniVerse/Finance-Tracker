/* =========================
   Categories
========================= */
const categoryMap = {
    Food: ["Eating Out", "Groceries", "Snacks", "Restaurants"],
    Entertainment: ["Movies", "Games", "Concerts", "Other"],
    Clothes: ["Shirts", "Pants", "Shoes", "Accessories"],
    Car: ["Fuel", "Rego", "Repair", "Tires", "Other"],
    Experiences: ["Travel", "Events", "Workshops", "Other"],
    Bills: ["Gas", "Electricity", "Internet", "Water", "Rent"]
};

const mainCategories = Object.keys(categoryMap);

/* =========================
   State
========================= */
let expenses = [];
let totalBudget = 0;
let editingExpenseId = null;
let overBudgetShown = false;

/* =========================
   Elements
========================= */
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const expenseDateInput = document.getElementById("expenseDate");
const mainCategorySelect = document.getElementById("mainCategory");
const subCategorySelect = document.getElementById("subCategory");
const addBtn = document.getElementById("addBtn");

const expenseTable = document.querySelector("#expenseTable tbody");
const totalSpan = document.getElementById("total");
const categoryTotalsTable = document.querySelector("#categoryTotals tbody");

const budgetOverlay = document.getElementById("budgetOverlay");
const initialBudgetInput = document.getElementById("initialBudget");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const budgetDisplay = document.getElementById("budgetDisplay");
const budgetProgress = document.getElementById("budgetProgress");

const overBudgetOverlay = document.getElementById("overBudgetOverlay");
const overBudgetOkBtn = document.getElementById("overBudgetOkBtn");

/* =========================
   Init
========================= */
mainCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    mainCategorySelect.appendChild(option);
});

updateSubCategories();
budgetOverlay.style.display = "flex";

/* =========================
   Events
========================= */
mainCategorySelect.addEventListener("change", updateSubCategories);

addBtn.addEventListener("click", addOrUpdateExpense);

setBudgetBtn.addEventListener("click", () => {
    const value = Number(initialBudgetInput.value);
    if (value <= 0) return alert("Enter a valid budget.");

    totalBudget = Math.round(value * 100) / 100;
    overBudgetShown = false;
    budgetOverlay.style.display = "none";
    updateBudgetDisplay();
});

overBudgetOkBtn.addEventListener("click", () => {
    overBudgetOverlay.style.display = "none";
});

/* =========================
   Functions
========================= */
function updateSubCategories() {
    const subs = categoryMap[mainCategorySelect.value];
    subCategorySelect.innerHTML = "";
    subs.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subCategorySelect.appendChild(option);
    });
}

function addOrUpdateExpense() {
    const name = nameInput.value.trim();
    const date = expenseDateInput.value;
    let amount = Math.round(Number(amountInput.value) * 100) / 100;

    if (!name || !date || amount <= 0) return;

    const expenseData = {
        id: editingExpenseId ?? Date.now(),
        name,
        amount,
        mainCat: mainCategorySelect.value,
        subCat: subCategorySelect.value,
        date
    };

    if (editingExpenseId) {
        const index = expenses.findIndex(e => e.id === editingExpenseId);
        expenses[index] = expenseData;
        editingExpenseId = null;
        addBtn.textContent = "Add Expense";
    } else {
        expenses.push(expenseData);
    }

    resetInputs();
    render();
}

function resetInputs() {
    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    mainCategorySelect.value = mainCategories[0];
    updateSubCategories();
}

function render() {
    expenseTable.innerHTML = "";

    expenses.forEach(exp => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${exp.name}</td>
            <td>$${exp.amount.toFixed(2)}</td>
            <td>${exp.mainCat}</td>
            <td>${exp.subCat}</td>
            <td>${exp.date}</td>
            <td></td>
        `;

        const actions = tr.lastElementChild;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editExpense(exp.id);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteExpense(exp.id);

        actions.append(editBtn, delBtn);
        expenseTable.appendChild(tr);
    });

    updateTotal();
    updateCategoryTotals();
    updateBudgetDisplay();
}

function editExpense(id) {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    nameInput.value = exp.name;
    amountInput.value = exp.amount;
    expenseDateInput.value = exp.date;
    mainCategorySelect.value = exp.mainCat;
    updateSubCategories();
    subCategorySelect.value = exp.subCat;

    editingExpenseId = id;
    addBtn.textContent = "Save Expense";
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    render();
}

function updateTotal() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalSpan.textContent = total.toFixed(2);
}

function updateCategoryTotals() {
    const totals = {};
    expenses.forEach(e => totals[e.mainCat] = (totals[e.mainCat] || 0) + e.amount);

    categoryTotalsTable.innerHTML = "";
    Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, amount]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${cat}</td><td>${amount.toFixed(2)}</td>`;
            categoryTotalsTable.appendChild(row);
        });
}

function updateBudgetDisplay() {
    if (totalBudget <= 0) {
        budgetProgress.style.width = "0%";
        budgetDisplay.textContent = "Budget: $0.00";
        return;
    }

    const spent = expenses.reduce((s, e) => s + e.amount, 0);
    const remaining = totalBudget - spent;

    budgetDisplay.textContent = `Budget: $${remaining.toFixed(2)}`;

    let percent = Math.min((spent / totalBudget) * 100, 100);
    budgetProgress.style.width = `${percent}%`;

    budgetDisplay.className = "";
    budgetProgress.style.background = "green";

    if (remaining <= totalBudget * 0.2) budgetProgress.style.background = "orange";
    if (remaining <= 0) {
        budgetProgress.style.background = "red";
        if (!overBudgetShown) {
            overBudgetOverlay.style.display = "flex";
            overBudgetShown = true;
        }
    }
}

/* =========================
   Upload / Download
========================= */
document.getElementById("uploadFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
        const lines = evt.target.result.split("\n").filter(l => l.trim());
        expenses = lines.map(line => {
            const [name, amount, mainCat, subCat, date] = line.split("|");
            return {
                id: Date.now() + Math.random(),
                name,
                amount: parseFloat(amount),
                mainCat,
                subCat,
                date
            };
        });
        render();
    };
    reader.readAsText(file);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    const data = expenses
        .map(e => `${e.name}|${e.amount.toFixed(2)}|${e.mainCat}|${e.subCat}|${e.date}`)
        .join("\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.txt";
    a.click();

    URL.revokeObjectURL(url);
});

/* =========================
   FAQ
========================= */
const faqBtn = document.getElementById("faqBtn");
const faqModal = document.getElementById("faqModal");
const closeFaqBtn = document.getElementById("closeFaqBtn");
const faqIframe = document.getElementById("faqIframe");

faqBtn.onclick = () => {
    faqModal.style.display = "flex";
    faqIframe.src = "finance-ai/faq.html";
};

closeFaqBtn.onclick = () => {
    faqModal.style.display = "none";
    faqIframe.src = "";
};
