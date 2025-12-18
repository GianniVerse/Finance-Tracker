/* =========================
   Categories
========================= */
const categories = [
    "Rent", "Groceries", "Utilities", "Entertainment",
    "Fitness", "Learning", "Transport", "Savings", "Other"
];

/* =========================
   State
========================= */
let lastBudget = {};
let increments = {};
let newBudget = {};
let expenses = [];
let editingId = null;

/* =========================
   Elements
========================= */
const setupOverlay = document.getElementById("setupOverlay");
const lastBudgetInputs = document.getElementById("lastBudgetInputs");
const setupBtn = document.getElementById("setupBtn");

const categorySelect = document.getElementById("categorySelect");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseDate = document.getElementById("expenseDate");
const addBtn = document.getElementById("addBtn");

const expenseTable = document.querySelector("#expenseTable tbody");
const budgetTable = document.querySelector("#budgetTable tbody");

const overBudgetOverlay = document.getElementById("overBudgetOverlay");
document.getElementById("overBudgetOkBtn").onclick = () =>
    overBudgetOverlay.style.display = "none";

expenseDate.valueAsDate = new Date();

/* =========================
   Init Setup Inputs
========================= */
categories.forEach(cat => {
    const div = document.createElement("div");
    div.innerHTML = `
        <label>${cat} Last Month: <input type="number" step="0.01" id="last_${cat}" value="0"></label>
        <label>Increment: <input type="number" step="0.01" id="inc_${cat}" value="0"></label>
    `;
    lastBudgetInputs.appendChild(div);

    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
});

/* =========================
   Setup Budget
========================= */
setupBtn.onclick = () => {
    lastBudget = {};
    increments = {};
    newBudget = {};
    expenses = [];

    categories.forEach(cat => {
        lastBudget[cat] = Number(document.getElementById(`last_${cat}`).value);
        increments[cat] = Number(document.getElementById(`inc_${cat}`).value);
        newBudget[cat] = lastBudget[cat] + increments[cat];
    });

    setupOverlay.style.display = "none";
    render();
};

/* =========================
   Add / Edit Expense
========================= */
addBtn.onclick = () => {
    const cat = categorySelect.value;
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const date = expenseDate.value;

    if (!name || amount <= 0 || !date) return;

    if (editingId) {
        const idx = expenses.findIndex(e => e.id === editingId);
        expenses[idx] = { id: editingId, category: cat, name, amount, date };
        editingId = null;
        addBtn.textContent = "Add Expense";
    } else {
        expenses.push({ id: Date.now(), category: cat, name, amount, date });
    }

    resetInputs();
    render();
};

function resetInputs() {
    expenseName.value = "";
    expenseAmount.value = "";
    expenseDate.valueAsDate = new Date();
}

/* =========================
   Render Tables
========================= */
function render() {
    // Render expenses
    expenseTable.innerHTML = "";
    expenses.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.category}</td>
            <td>${e.name}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.date}</td>
            <td>
                <button onclick="editExpense(${e.id})">Edit</button>
                <button onclick="deleteExpense(${e.id})">Delete</button>
            </td>`;
        expenseTable.appendChild(tr);
    });

    // Render budget table
    budgetTable.innerHTML = "";
    categories.forEach(cat => {
        const spent = expenses
            .filter(e => e.category === cat)
            .reduce((s, e) => s + e.amount, 0);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cat}</td>
            <td>$${lastBudget[cat].toFixed(2)}</td>
            <td>$${increments[cat].toFixed(2)}</td>
            <td>$${newBudget[cat].toFixed(2)}</td>
            <td>$${spent.toFixed(2)}</td>
        `;
        budgetTable.appendChild(tr);
    });
}

window.editExpense = (id) => {
    const e = expenses.find(x => x.id === id);
    expenseName.value = e.name;
    expenseAmount.value = e.amount;
    expenseDate.value = e.date;
    categorySelect.value = e.category;
    editingId = id;
    addBtn.textContent = "Save Expense";
};

window.deleteExpense = (id) => {
    expenses = expenses.filter(e => e.id !== id);
    render();
};

/* =========================
   Download / Upload
========================= */
document.getElementById("downloadBtn").onclick = () => {
    let lines = ["#LAST_BUDGET"];
    categories.forEach(cat => {
        lines.push(`${cat}|${lastBudget[cat]}|${increments[cat]}|${newBudget[cat]}`);
    });
    lines.push("#EXPENSES");
    expenses.forEach(e => {
        lines.push(`${e.category}|${e.name}|${e.amount}|${e.date}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "incremental-budget.txt";
    a.click();
};

document.getElementById("uploadFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        try {
            const lines = evt.target.result.split("\n").map(l => l.trim());
            let section = null;
            lastBudget = {};
            increments = {};
            newBudget = {};
            expenses = [];

            lines.forEach(line => {
                if (line === "#LAST_BUDGET") { section = "budget"; return; }
                if (line === "#EXPENSES") { section = "expenses"; return; }
                if (!line) return;

                if (section === "budget") {
                    const [cat, last, inc, newB] = line.split("|");
                    lastBudget[cat] = Number(last);
                    increments[cat] = Number(inc);
                    newBudget[cat] = Number(newB);
                } else if (section === "expenses") {
                    const [cat, name, amount, date] = line.split("|");
                    expenses.push({
                        id: Date.now() + Math.random(),
                        category: cat,
                        name,
                        amount: Number(amount),
                        date
                    });
                }
            });
            setupOverlay.style.display = "none";
            render();
        } catch {
            alert("Invalid budget file.");
        }
    };
    reader.readAsText(file);
});
