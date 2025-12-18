/* =========================
   Categories
========================= */
const categoryMap = {
    Housing: ["Rent", "Utilities"],
    Food: ["Groceries", "Dining"],
    Transport: ["Fuel", "Transit"],
    Bills: ["Phone", "Internet"],
    Fun: ["Entertainment", "Shopping"],
    Other: ["Misc"]
};

/* =========================
   State
========================= */
let expenses = [];
let income = 0;
let savings = 0;
let spendable = 0;
let editingId = null;

/* =========================
   Elements
========================= */
const mainCategory = document.getElementById("mainCategory");
const subCategory = document.getElementById("subCategory");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("expenseDate");
const addBtn = document.getElementById("addBtn");

const setupOverlay = document.getElementById("setupOverlay");
const incomeInput = document.getElementById("incomeInput");
const savingsInput = document.getElementById("savingsInput");

const budgetDisplay = document.getElementById("budgetDisplay");
const budgetProgress = document.getElementById("budgetProgress");

const expenseTable = document.querySelector("#expenseTable tbody");
const totalsTable = document.querySelector("#totalsTable tbody");

const overBudgetOverlay = document.getElementById("overBudgetOverlay");
document.getElementById("overBudgetOkBtn").onclick = () =>
    overBudgetOverlay.style.display = "none";

/* =========================
   Init
========================= */
initCategories();
dateInput.valueAsDate = new Date();

function initCategories() {
    Object.keys(categoryMap).forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        mainCategory.appendChild(opt);
    });
    updateSubCategories();
}

mainCategory.addEventListener("change", updateSubCategories);
addBtn.addEventListener("click", addOrUpdate);

/* =========================
   Setup
========================= */
document.getElementById("setupBtn").onclick = () => {
    income = Number(incomeInput.value);
    const savingsPercent = Number(savingsInput.value);

    if (income <= 0 || savingsPercent < 0) return;

    savings = +(income * (savingsPercent / 100)).toFixed(2);
    spendable = income - savings;

    setupOverlay.style.display = "none";
    render();
};

/* =========================
   Core Functions
========================= */
function updateSubCategories() {
    subCategory.innerHTML = "";
    categoryMap[mainCategory.value].forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.textContent = sub;
        subCategory.appendChild(opt);
    });
}

function addOrUpdate() {
    const name = nameInput.value.trim();
    const amount = +amountInput.value;
    const date = dateInput.value;

    if (!name || amount <= 0 || !date) return;

    let spent = expenses.reduce((s, e) => s + e.amount, 0);

    if (editingId) {
        const old = expenses.find(e => e.id === editingId);
        spent -= old.amount;
    }

    if (spent + amount > spendable) {
        overBudgetOverlay.style.display = "flex";
        return;
    }

    if (editingId) {
        const idx = expenses.findIndex(e => e.id === editingId);
        expenses[idx] = {
            id: editingId,
            name,
            amount,
            date,
            mainCat: mainCategory.value,
            subCat: subCategory.value
        };
        editingId = null;
        addBtn.textContent = "Add Expense";
    } else {
        expenses.push({
            id: Date.now(),
            name,
            amount,
            date,
            mainCat: mainCategory.value,
            subCat: subCategory.value
        });
    }

    resetInputs();
    render();
}

function render() {
    expenseTable.innerHTML = "";

    expenses.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.mainCat}</td>
            <td>${e.subCat}</td>
            <td>${e.date}</td>
            <td>
                <button onclick="editExpense(${e.id})">Edit</button>
                <button onclick="deleteExpense(${e.id})">Delete</button>
            </td>`;
        expenseTable.appendChild(tr);
    });

    const spent = expenses.reduce((s, e) => s + e.amount, 0);
    const remaining = spendable - spent;

    budgetDisplay.textContent = `Remaining: $${remaining.toFixed(2)}`;

    const percent = spendable > 0 ? (spent / spendable) * 100 : 0;
    budgetProgress.style.width = `${Math.min(percent, 100)}%`;
    budgetProgress.style.background =
        remaining > spendable * 0.5 ? "green" :
        remaining > spendable * 0.2 ? "orange" : "red";

    totalsTable.innerHTML = `
        <tr><td>Income</td><td>$${income.toFixed(2)}</td></tr>
        <tr><td>Savings (locked)</td><td>$${savings.toFixed(2)}</td></tr>
        <tr><td>Spendable</td><td>$${spendable.toFixed(2)}</td></tr>
    `;
}

function editExpense(id) {
    const e = expenses.find(x => x.id === id);
    nameInput.value = e.name;
    amountInput.value = e.amount;
    dateInput.value = e.date;
    mainCategory.value = e.mainCat;
    updateSubCategories();
    subCategory.value = e.subCat;
    editingId = id;
    addBtn.textContent = "Save Expense";
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    render();
}

function resetInputs() {
    nameInput.value = "";
    amountInput.value = "";
    dateInput.valueAsDate = new Date();
}

/* =========================
   Download (.txt)
========================= */
document.getElementById("downloadBtn").onclick = () => {
    let lines = [];

    // Budget info
    lines.push("#BUDGET");
    lines.push(`income|${income}`);
    lines.push(`savings|${savings}`);
    lines.push(`spendable|${spendable}`);

    // Expenses
    lines.push("#EXPENSES");
    expenses.forEach(e => {
        lines.push(`${e.name}|${e.amount}|${e.mainCat}|${e.subCat}|${e.date}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pay-yourself-first-budget.txt";
    a.click();
};

/* =========================
   Upload (.txt)
========================= */
document.getElementById("uploadFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
        try {
            const lines = evt.target.result.split("\n").map(l => l.trim());
            let section = null;

            expenses = [];
            income = 0;
            savings = 0;
            spendable = 0;

            lines.forEach(line => {
                if (line === "#BUDGET") {
                    section = "budget";
                    return;
                }
                if (line === "#EXPENSES") {
                    section = "expenses";
                    return;
                }
                if (!line) return;

                if (section === "budget") {
                    const [key, value] = line.split("|");
                    if (key === "income") income = Number(value);
                    else if (key === "savings") savings = Number(value);
                    else if (key === "spendable") spendable = Number(value);
                } else if (section === "expenses") {
                    const [name, amount, mainCat, subCat, date] = line.split("|");
                    expenses.push({
                        id: Date.now() + Math.random(),
                        name,
                        amount: Number(amount),
                        mainCat,
                        subCat,
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
