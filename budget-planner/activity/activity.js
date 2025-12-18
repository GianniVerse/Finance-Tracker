/* =========================
   Categories
========================= */
const categoryMap = {
    Work: ["Salary", "Freelance", "Side Hustle", "Investments", "Bonuses"],
    Fitness: ["Gym", "Sports", "Yoga", "Personal Training", "Outdoor Activities"],
    Leisure: ["Movies", "Travel", "Dining Out", "Concerts", "Gaming", "Hobbies"],
    Learning: ["Courses", "Books", "Workshops", "Online Subscriptions", "Tutoring"],
    Health: ["Medical", "Dental", "Pharmacy", "Therapy", "Vision"],
    Transport: ["Fuel", "Public Transit", "Ride Sharing", "Car Maintenance", "Parking"],
    Housing: ["Rent", "Mortgage", "Utilities", "Maintenance", "Insurance"],
    Food: ["Groceries", "Dining Out", "Coffee", "Snacks", "Meal Delivery"],
    Bills: ["Phone", "Internet", "Electricity", "Water", "Insurance"],
    Social: ["Gifts", "Charity", "Events", "Subscriptions", "Clubs"],
    Other: ["Misc", "Unexpected Expenses", "Emergency Fund", "Pet Care"]
};


/* =========================
   State
========================= */
let activities = [];
let income = 0;
let remaining = 0;
let editingId = null;

/* =========================
   Elements
========================= */
const mainCategory = document.getElementById("mainCategory");
const subCategory = document.getElementById("subCategory");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("activityDate");
const addBtn = document.getElementById("addBtn");

const setupOverlay = document.getElementById("setupOverlay");
const incomeInput = document.getElementById("incomeInput");

const budgetDisplay = document.getElementById("budgetDisplay");
const budgetProgress = document.getElementById("budgetProgress");

const activityTable = document.querySelector("#activityTable tbody");
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
    if (income <= 0) return;

    remaining = income;
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

    let spent = activities.reduce((s, e) => s + e.amount, 0);

    if (editingId) {
        const old = activities.find(e => e.id === editingId);
        spent -= old.amount;
    }

    if (spent + amount > income) {
        overBudgetOverlay.style.display = "flex";
        return;
    }

    if (editingId) {
        const idx = activities.findIndex(e => e.id === editingId);
        activities[idx] = {
            id: editingId,
            name,
            amount,
            date,
            mainCat: mainCategory.value,
            subCat: subCategory.value
        };
        editingId = null;
        addBtn.textContent = "Add Activity";
    } else {
        activities.push({
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
    activityTable.innerHTML = "";

    activities.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.name}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.mainCat}</td>
            <td>${e.subCat}</td>
            <td>${e.date}</td>
            <td>
                <button onclick="editActivity(${e.id})">Edit</button>
                <button onclick="deleteActivity(${e.id})">Delete</button>
            </td>`;
        activityTable.appendChild(tr);
    });

    const spent = activities.reduce((s, e) => s + e.amount, 0);
    remaining = income - spent;

    budgetDisplay.textContent = `Remaining: $${remaining.toFixed(2)}`;

    const percent = income > 0 ? (spent / income) * 100 : 0;
    budgetProgress.style.width = `${Math.min(percent, 100)}%`;
    budgetProgress.style.background =
        remaining > income * 0.5 ? "green" :
        remaining > income * 0.2 ? "orange" : "red";

    totalsTable.innerHTML = `
        <tr><td>Total Income</td><td>$${income.toFixed(2)}</td></tr>
        <tr><td>Spent</td><td>$${spent.toFixed(2)}</td></tr>
        <tr><td>Remaining</td><td>$${remaining.toFixed(2)}</td></tr>
    `;
}

function editActivity(id) {
    const e = activities.find(x => x.id === id);
    nameInput.value = e.name;
    amountInput.value = e.amount;
    dateInput.value = e.date;
    mainCategory.value = e.mainCat;
    updateSubCategories();
    subCategory.value = e.subCat;
    editingId = id;
    addBtn.textContent = "Save Activity";
}

function deleteActivity(id) {
    activities = activities.filter(e => e.id !== id);
    render();
}

function resetInputs() {
    nameInput.value = "";
    amountInput.value = "";
    dateInput.valueAsDate = new Date();
}

/* =========================
   Download / Upload
========================= */
document.getElementById("downloadBtn").onclick = () => {
    let lines = [];
    lines.push("#BUDGET");
    lines.push(`income|${income}`);
    lines.push("#ACTIVITIES");
    activities.forEach(e => {
        lines.push(`${e.name}|${e.amount}|${e.mainCat}|${e.subCat}|${e.date}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "activity-budget.txt";
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

            activities = [];
            income = 0;
            remaining = 0;

            lines.forEach(line => {
                if (line === "#BUDGET") {
                    section = "budget";
                    return;
                }
                if (line === "#ACTIVITIES") {
                    section = "activities";
                    return;
                }
                if (!line) return;

                if (section === "budget") {
                    const [key, value] = line.split("|");
                    if (key === "income") income = Number(value);
                } else if (section === "activities") {
                    const [name, amount, mainCat, subCat, date] = line.split("|");
                    activities.push({
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
