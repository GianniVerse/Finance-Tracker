/* =========================
   Data & Elements
========================= */
let envelopeBalances = {}; // category -> current funds
let expenses = [];
let editingExpenseId = null;

const categories = ["Housing", "Food", "Transport", "Entertainment", "Healthcare", "Savings", "Other"];
const recommendedPercent = {
    Housing: 30,
    Food: 15,
    Transport: 10,
    Entertainment: 10,
    Healthcare: 10,
    Savings: 20,
    Other: 5
};

/* Elements */
const topupCategory = document.getElementById("topupCategory");
const topupAmount = document.getElementById("topupAmount");
const topupBtn = document.getElementById("topupBtn");

const categorySelect = document.getElementById("categorySelect");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const expenseDateInput = document.getElementById("expenseDate");
const addBtn = document.getElementById("addBtn");

const expenseTable = document.querySelector("#expenseTable tbody");
const envelopeTotalsTable = document.querySelector("#envelopeTotals tbody");

const incomeInput = document.getElementById("incomeInput");
const calcAllocationBtn = document.getElementById("calcAllocationBtn");
const suggestedTable = document.getElementById("suggestedTable").querySelector("tbody");

const overBudgetOverlay = document.getElementById("overBudgetOverlay");
const overBudgetOkBtn = document.getElementById("overBudgetOkBtn");

overBudgetOkBtn.addEventListener("click", () => overBudgetOverlay.style.display = "none");

/* =========================
   Initialization
========================= */
categories.forEach(cat => {
    envelopeBalances[cat] = 0;

    const option1 = document.createElement("option");
    option1.value = cat;
    option1.textContent = cat;
    topupCategory.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = cat;
    option2.textContent = cat;
    categorySelect.appendChild(option2);
});

/* =========================
   Suggested Allocation
========================= */
calcAllocationBtn.addEventListener("click", () => {
    const income = parseFloat(incomeInput.value);
    if (isNaN(income) || income <= 0) return alert("Enter a valid income amount");

    suggestedTable.innerHTML = "";
    categories.forEach(cat => {
        const perc = recommendedPercent[cat] || 0;
        const amount = (income * perc / 100).toFixed(2);
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${cat}</td><td>${perc}%</td><td>$${amount}</td>`;
        suggestedTable.appendChild(tr);
    });
});

/* =========================
   Top-Up Envelope
========================= */
topupBtn.addEventListener("click", () => {
    const cat = topupCategory.value;
    const amount = parseFloat(topupAmount.value);
    if (isNaN(amount) || amount <= 0) return;

    envelopeBalances[cat] += amount;
    topupAmount.value = "";
    render();
});

/* =========================
   Add / Edit Expense
========================= */
addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = expenseDateInput.value;

    if (!name || !date || isNaN(amount) || amount <= 0) return;

    if (editingExpenseId) {
        const idx = expenses.findIndex(e => e.id === editingExpenseId);
        envelopeBalances[expenses[idx].category] += expenses[idx].amount; // restore old
        if (envelopeBalances[category] < amount) {
            envelopeBalances[expenses[idx].category] -= expenses[idx].amount; // rollback
            overBudgetOverlay.style.display = "flex";
            return;
        }
        expenses[idx] = { id: editingExpenseId, name, amount, category, date };
        envelopeBalances[category] -= amount;
        editingExpenseId = null;
        addBtn.textContent = "Add Expense";
    } else {
        if (envelopeBalances[category] < amount) {
            overBudgetOverlay.style.display = "flex";
            return;
        }
        expenses.push({ id: Date.now(), name, amount, category, date });
        envelopeBalances[category] -= amount;
    }

    resetInputs();
    render();
});

function resetInputs() {
    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    categorySelect.value = categories[0];
}

/* =========================
   Render Tables
========================= */
function render() {
    // Expenses
    expenseTable.innerHTML = "";
    expenses.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${e.name}</td><td>$${e.amount.toFixed(2)}</td><td>${e.category}</td><td>${e.date}</td><td></td>`;
        const actions = tr.lastElementChild;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editExpense(e.id);
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteExpense(e.id);
        actions.append(editBtn, delBtn);
        expenseTable.appendChild(tr);
    });

    // Envelope balances
    envelopeTotalsTable.innerHTML = "";
    categories.forEach(cat => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${cat}</td><td>$${envelopeBalances[cat].toFixed(2)}</td>`;
        envelopeTotalsTable.appendChild(row);
    });
}

/* =========================
   Edit / Delete
========================= */
function editExpense(id) {
    const e = expenses.find(ex => ex.id === id);
    if (!e) return;
    nameInput.value = e.name;
    amountInput.value = e.amount;
    expenseDateInput.value = e.date;
    categorySelect.value = e.category;
    addBtn.textContent = "Save Expense";
    editingExpenseId = id;
}

function deleteExpense(id) {
    const e = expenses.find(ex => ex.id === id);
    envelopeBalances[e.category] += e.amount; // refund
    expenses = expenses.filter(ex => ex.id !== id);
    render();
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

        // Reset
        expenses = [];
        categories.forEach(cat => envelopeBalances[cat] = 0);

        let section = null;
        lines.forEach(line => {
            if (line === "#BALANCES") { section = "balances"; return; }
            if (line === "#EXPENSES") { section = "expenses"; return; }
            if (section === "balances") {
                const [cat, amt] = line.split("|");
                envelopeBalances[cat] = parseFloat(amt);
            } else if (section === "expenses") {
                const [name, amt, cat, date] = line.split("|");
                expenses.push({ id: Date.now() + Math.random(), name, amount: parseFloat(amt), category: cat, date });
            }
        });

        render();
    };
    reader.readAsText(file);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    let data = "#BALANCES\n";
    categories.forEach(cat => {
        data += `${cat}|${envelopeBalances[cat].toFixed(2)}\n`;
    });
    data += "#EXPENSES\n";
    data += expenses.map(e => `${e.name}|${e.amount.toFixed(2)}|${e.category}|${e.date}`).join("\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "envelope-budget.txt";
    a.click();
    URL.revokeObjectURL(url);
});
