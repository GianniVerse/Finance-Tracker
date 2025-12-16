/* =========================
   Categories
========================= */
const categoryMap = {
    needs: {
        Groceries: ["Supermarket", "Snacks", "Drinks"],
        Rent: ["Apartment", "Utilities"],
        Transport: ["Fuel", "Public Transit"],
        Bills: ["Electricity", "Water", "Internet"],
        Pets: ["Food", "Vet", "Toys"],
        Medication: ["Prescriptions", "Supplements"],
        Insurance: ["Health", "Car", "Home"],
        Healthcare: ["Doctor", "Dental", "Optical"],
        "Credit/Phone": ["Credit Card", "Phone Bill"],
        Clothes: ["Shirts", "Pants", "Shoes"],
        Other: ["Misc"]
    },
    wants: {
        Dates: ["Movies", "Dining"],
        "Fast Food": ["Burgers", "Pizza"],
        Subscriptions: ["Netflix", "Spotify"],
        Entertainment: ["Concerts", "Games"],
        Makeup: ["Skincare", "Cosmetics"],
        Experiences: ["Travel", "Events"],
        Other: ["Misc"]
    }
};

const sections = ["needs", "wants", "savings"];
let expenses = [];
let totalBudget = 0;
let sectionBudgets = { needs: 0, wants: 0, savings: 0 };
let editingExpenseId = null;

/* =========================
   Elements
========================= */
const sectionSelect = document.getElementById("sectionSelect");
const mainCategorySelect = document.getElementById("mainCategory");
const subCategorySelect = document.getElementById("subCategory");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const expenseDateInput = document.getElementById("expenseDate");
const addBtn = document.getElementById("addBtn");

const expenseTable = document.querySelector("#expenseTable tbody");
const sectionTotalsTable = document.querySelector("#sectionTotals tbody");

const budgetOverlay = document.getElementById("budgetOverlay");
const initialBudgetInput = document.getElementById("initialBudget");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const budgetDisplay = document.getElementById("budgetDisplay");
const budgetProgress = document.getElementById("budgetProgress");

const overBudgetOverlay = document.getElementById("overBudgetOverlay");
const overBudgetOkBtn = document.getElementById("overBudgetOkBtn");

overBudgetOkBtn.addEventListener("click", () => overBudgetOverlay.style.display = "none");

/* =========================
   Init
========================= */
updateMainCategories();
updateSubCategories();

sectionSelect.addEventListener("change", () => {
    updateMainCategories();
    updateSubCategories();
});

mainCategorySelect.addEventListener("change", updateSubCategories);

addBtn.addEventListener("click", addOrUpdateExpense);

/* =========================
   Budget Setup
========================= */
setBudgetBtn.addEventListener("click", () => {
    const val = Number(initialBudgetInput.value);
    if (val <= 0) return alert("Enter a valid budget");

    totalBudget = val;
    sectionBudgets = {
        needs: totalBudget * 0.5,
        wants: totalBudget * 0.3,
        savings: totalBudget * 0.2
    };

    updateSavingsExpense();
    budgetOverlay.style.display = "none";
    render();
});

/* =========================
   Functions
========================= */
function updateSavingsExpense() {
    const savingsExpense = expenses.find(e => e.section === "savings");
    if (savingsExpense) {
        savingsExpense.amount = sectionBudgets.savings;
    } else {
        expenses.push({
            id: Date.now(),
            name: "Savings",
            amount: sectionBudgets.savings,
            section: "savings",
            mainCat: "N/A",
            subCat: "N/A",
            date: new Date().toISOString().split("T")[0]
        });
    }
}

function updateMainCategories() {
    const sec = sectionSelect.value;
    mainCategorySelect.innerHTML = "";
    const cats = Object.keys(categoryMap[sec] || {});
    cats.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        mainCategorySelect.appendChild(option);
    });
}

function updateSubCategories() {
    const sec = sectionSelect.value;
    const main = mainCategorySelect.value;
    subCategorySelect.innerHTML = "";
    if (!main || !categoryMap[sec]) return;
    const subs = categoryMap[sec][main];
    subs.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subCategorySelect.appendChild(option);
    });
}

function addOrUpdateExpense() {
    const section = sectionSelect.value;
    if (section === "savings") {
        alert("Savings is automatically set to 20% of the total budget and cannot be edited.");
        return;
    }

    const name = nameInput.value.trim();
    const date = expenseDateInput.value;
    const amount = Math.round(Number(amountInput.value) * 100) / 100;
    const mainCat = mainCategorySelect.value;
    const subCat = subCategorySelect.value;

    if (!name || !date || amount <= 0) return;

    const sectionTotal = expenses
        .filter(e => e.section === section)
        .reduce((sum, e) => sum + e.amount, 0);
    if (sectionTotal + amount > sectionBudgets[section]) {
        overBudgetOverlay.style.display = "flex";
        return;
    }

    if (editingExpenseId) {
        const idx = expenses.findIndex(e => e.id === editingExpenseId);
        expenses[idx] = { id: editingExpenseId, name, amount, section, mainCat, subCat, date };
        editingExpenseId = null;
        addBtn.textContent = "Add Expense";
    } else {
        expenses.push({ id: Date.now(), name, amount, section, mainCat, subCat, date });
    }

    resetInputs();
    render();
}

function resetInputs() {
    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    sectionSelect.value = "needs";
    updateMainCategories();
    updateSubCategories();
}

function render() {
    expenseTable.innerHTML = "";
    expenses.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${capitalize(e.section)}</td>
            <td>${e.mainCat}</td>
            <td>${e.subCat}</td>
            <td>${e.date}</td>
            <td></td>
        `;
        const actions = tr.lastElementChild;
        if (e.section !== "savings") {
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => editExpense(e.id);
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.onclick = () => deleteExpense(e.id);
            actions.append(editBtn, delBtn);
        }
        expenseTable.appendChild(tr);
    });

    sectionTotalsTable.innerHTML = "";
    sections.forEach(sec => {
        const total = expenses.filter(e => e.section === sec).reduce((sum, e) => sum + e.amount, 0);
        const row = document.createElement("tr");
        row.innerHTML = `<td>${capitalize(sec)}</td><td>${total.toFixed(2)}</td><td>${sectionBudgets[sec] ? sectionBudgets[sec].toFixed(2) : "N/A"}</td>`;
        if (sec === "savings") {
            row.style.backgroundColor = "#f0f0f0";
            row.style.fontStyle = "italic";
        }
        sectionTotalsTable.appendChild(row);
    });

    const spentTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    budgetDisplay.textContent = `Budget: $${(totalBudget - spentTotal).toFixed(2)}`;
    const percent = Math.min((spentTotal / totalBudget) * 100, 100);
    budgetProgress.style.width = `${percent}%`;
    budgetProgress.style.background = percent < 50 ? "green" : percent < 80 ? "orange" : "red";
}

function editExpense(id) {
    const e = expenses.find(ex => ex.id === id);
    if (!e || e.section === "savings") return;
    nameInput.value = e.name;
    amountInput.value = e.amount;
    expenseDateInput.value = e.date;
    sectionSelect.value = e.section;
    updateMainCategories();
    mainCategorySelect.value = e.mainCat;
    updateSubCategories();
    subCategorySelect.value = e.subCat;
    addBtn.textContent = "Save Expense";
    editingExpenseId = id;
}

function deleteExpense(id) {
    const e = expenses.find(ex => ex.id === id);
    if (e.section === "savings") return;
    expenses = expenses.filter(e => e.id !== id);
    render();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
        expenses = [];

        let section = null;
        lines.forEach(line => {
            if (line === "#BUDGET") { section = "budget"; return; }
            if (line === "#EXPENSES") { section = "expenses"; return; }

            if (section === "budget") {
                const [total, needs, wants, savings] = line.split("|").map(Number);
                totalBudget = total;
                sectionBudgets = { needs, wants, savings };
            } else if (section === "expenses") {
                const [name, amount, sectionName, mainCat, subCat, date] = line.split("|");
                if (sectionName === "savings") return; // skip old savings
                expenses.push({ id: Date.now() + Math.random(), name, amount: parseFloat(amount), section: sectionName, mainCat, subCat, date });
            }
        });

        // Recreate savings properly
        updateSavingsExpense();
        render();
    };
    reader.readAsText(file);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    let data = `#BUDGET\n${totalBudget}|${sectionBudgets.needs}|${sectionBudgets.wants}|${sectionBudgets.savings}\n#EXPENSES\n`;
    data += expenses.map(e => `${e.name}|${e.amount.toFixed(2)}|${e.section}|${e.mainCat}|${e.subCat}|${e.date}`).join("\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "50-30-20-expenses.txt";
    a.click();
    URL.revokeObjectURL(url);
});
