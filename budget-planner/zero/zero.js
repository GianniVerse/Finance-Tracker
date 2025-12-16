let totalBudget = 0;
let expenses = [];
let editingExpenseId = null;

/* =========================
   Elements
========================= */
const categorySelect = document.getElementById("categorySelect");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const expenseDateInput = document.getElementById("expenseDate");
const addBtn = document.getElementById("addBtn");

const expenseTable = document.querySelector("#expenseTable tbody");
const categoryTotalsTable = document.querySelector("#categoryTotals tbody");

const budgetOverlay = document.getElementById("budgetOverlay");
const initialBudgetInput = document.getElementById("initialBudget");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const budgetDisplay = document.getElementById("budgetDisplay");
const budgetProgress = document.getElementById("budgetProgress");

const overBudgetOverlay = document.getElementById("overBudgetOverlay");
const overBudgetOkBtn = document.getElementById("overBudgetOkBtn");

overBudgetOkBtn.addEventListener("click", () => overBudgetOverlay.style.display = "none");

/* =========================
   Budget Setup
========================= */
setBudgetBtn.addEventListener("click", () => {
    const val = Number(initialBudgetInput.value);
    if (val <= 0) return alert("Enter a valid budget");

    totalBudget = val;
    budgetOverlay.style.display = "none";
    render();
});

/* =========================
   Add / Edit Expense
========================= */
addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const amount = Math.round(Number(amountInput.value) * 100) / 100;
    const category = categorySelect.value;
    const date = expenseDateInput.value;

    if (!name || !date || amount <= 0) return;

    // Over-budget check excluding the current expense if editing
    const allocatedTotal = expenses
        .filter(e => e.id !== editingExpenseId)
        .reduce((sum, e) => sum + e.amount, 0);

    if (allocatedTotal + amount > totalBudget) {
        overBudgetOverlay.style.display = "flex";
        return;
    }

    if (editingExpenseId) {
        const idx = expenses.findIndex(e => e.id === editingExpenseId);
        expenses[idx] = { id: editingExpenseId, name, amount, category, date };
        editingExpenseId = null;
        addBtn.textContent = "Add Item";
    } else {
        expenses.push({ id: Date.now(), name, amount, category, date });
    }

    resetInputs();
    render();
});

function resetInputs() {
    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    categorySelect.value = "Housing";
}

/* =========================
   Render Functions
========================= */
function render() {
    // Expense table
    expenseTable.innerHTML = "";
    expenses.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.category}</td>
            <td>${e.date}</td>
            <td></td>
        `;
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

    // Category totals
    const categories = [...new Set(expenses.map(e => e.category))];
    categoryTotalsTable.innerHTML = "";
    categories.forEach(cat => {
        const total = expenses
            .filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0);
        const row = document.createElement("tr");
        row.innerHTML = `<td>${cat}</td><td>${total.toFixed(2)}</td>`;
        categoryTotalsTable.appendChild(row);
    });

    // Budget display & progress bar
    const spentTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - spentTotal;
    budgetDisplay.textContent = `Remaining Budget: $${remaining.toFixed(2)}`;

    const percent = Math.min((spentTotal / totalBudget) * 100, 100);
    budgetProgress.style.width = `${percent}%`;
    budgetProgress.style.background = percent < 50 ? "green" : percent < 80 ? "orange" : "red";
}

/* =========================
   Edit / Delete Functions
========================= */
function editExpense(id) {
    const e = expenses.find(ex => ex.id === id);
    if (!e) return;
    nameInput.value = e.name;
    amountInput.value = e.amount;
    expenseDateInput.value = e.date;
    categorySelect.value = e.category;
    addBtn.textContent = "Save Item";
    editingExpenseId = id;
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    render();
}

/* =========================
   Upload / Download (fixed)
========================= */
document.getElementById("uploadFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        const lines = evt.target.result.split("\n").filter(l => l.trim());
        
        // Reset
        expenses = [];
        totalBudget = 0;

        let section = null;
        lines.forEach(line => {
            if (line === "#BUDGET") { section = "budget"; return; }
            if (line === "#EXPENSES") { section = "expenses"; return; }

            if (section === "budget") {
                totalBudget = parseFloat(line);
            } else if (section === "expenses") {
                const [name, amount, category, date] = line.split("|");
                expenses.push({ id: Date.now() + Math.random(), name, amount: parseFloat(amount), category, date });
            }
        });

        render();
    };
    reader.readAsText(file);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    let data = "#BUDGET\n";
    data += totalBudget.toFixed(2) + "\n";
    data += "#EXPENSES\n";
    data += expenses.map(e => `${e.name}|${e.amount.toFixed(2)}|${e.category}|${e.date}`).join("\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zero-based-expenses.txt";
    a.click();
    URL.revokeObjectURL(url);
});
