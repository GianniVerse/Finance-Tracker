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
let editingId = null;
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
overBudgetOkBtn.addEventListener('click', ()=> overBudgetOverlay.style.display='none');

const downloadBtn = document.getElementById('downloadBtn');
const uploadFile = document.getElementById('uploadFile');

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
    amount = Math.round(amount*100)/100;
    const mainCat = mainCategorySelect.value;
    const subCat = subCategorySelect.value;
    const date = expenseDateInput.value;

    if (name === "" || amount <= 0 || date==="") return;

    expenses.push({id: Date.now(), name, amount, mainCat, subCat, date});
    nameInput.value = "";
    amountInput.value = "";
    expenseDateInput.value = "";
    mainCategorySelect.value = mainCategories[0];
    updateSubCategories();
    render();
});

// Set initial budget
setBudgetBtn.addEventListener('click', () => {
    const budget = Number(initialBudgetInput.value);
    if (budget <= 0) return alert("Enter a valid budget.");
    totalBudget = Math.round(budget*100)/100;
    updateBudgetDisplay();
    budgetOverlay.style.display = 'none';
});

// Edit budget
budgetDisplay.addEventListener('click', () => {
    const newBudget = prompt("Enter new total budget:", totalBudget);
    if (newBudget === null) return;
    const parsed = Number(newBudget);
    if (isNaN(parsed) || parsed <= 0) return alert("Enter a valid number.");
    totalBudget = Math.round(parsed*100)/100;
    updateBudgetDisplay();
});

// Download with expenses and category totals
downloadBtn.addEventListener('click', () => {
    let text = `Budget: $${totalBudget.toFixed(2)}\n\nExpenses:\n`;
    expenses.forEach(e => {
        text += `${e.name} - $${e.amount.toFixed(2)} - ${e.mainCat} - ${e.subCat} - ${e.date}\n`;
    });

    // Category totals (main categories only)
    const totals = {};
    expenses.forEach(e => {
        totals[e.mainCat] = (totals[e.mainCat] || 0) + e.amount;
    });

    text += `\nCategory Totals:\n`;
    for (const [cat, amount] of Object.entries(totals)) {
        if (amount > 0) text += `${cat}: $${amount.toFixed(2)}\n`;
    }

    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.txt";
    a.click();
    URL.revokeObjectURL(url);
});

// Upload
uploadFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const lines = evt.target.result.split("\n").map(l=>l.trim()).filter(l=>l!=="");
            const budgetMatch = lines.shift().match(/Budget:\s*\$?(\d+(\.\d+)?)/);
            if (!budgetMatch) throw "Invalid format";
            totalBudget = parseFloat(budgetMatch[1]);
            while(lines.length && !lines[0].startsWith("Expenses:")) lines.shift();
            if(lines.length) lines.shift(); // remove "Expenses:"
            expenses = [];
            while(lines.length && !lines[0].startsWith("Category Totals:")) {
                const line = lines.shift();
                const parts = line.split(" - ");
                if(parts.length<5) continue;
                const [name, amountStr, mainCat, subCat, date] = parts;
                const amount = parseFloat(amountStr.replace('$',''));
                expenses.push({id: Date.now()+Math.random(), name: name.trim(), amount, mainCat: mainCat.trim(), subCat: subCat.trim(), date: date.trim()});
            }
            render();
        } catch(err) {
            alert("Invalid text file!");
            console.error(err);
        }
    };
    reader.readAsText(file);
});

// Render
function render() {
    expenseTable.innerHTML = "";
    expenses.forEach(expense => {
        const tr = document.createElement("tr");

        if(editingId !== expense.id) {
            tr.innerHTML = `<td>${expense.name}</td>
                            <td>$${expense.amount.toFixed(2)}</td>
                            <td>${expense.mainCat}</td>
                            <td>${expense.subCat}</td>
                            <td>${expense.date}</td>
                            <td><button onclick="editExpense(${expense.id})">Edit</button></td>`;
        } else {
            const tdName = document.createElement("td");
            const nameInputEdit = document.createElement("input");
            nameInputEdit.value = expense.name;
            tdName.appendChild(nameInputEdit);

            const tdAmount = document.createElement("td");
            const amountInputEdit = document.createElement("input");
            amountInputEdit.type="number";
            amountInputEdit.step="0.01";
            amountInputEdit.value = expense.amount.toFixed(2);
            tdAmount.appendChild(amountInputEdit);

            const tdMain = document.createElement("td");
            const mainCatEdit = document.createElement("select");
            mainCategories.forEach(cat=>{
                const option = document.createElement("option");
                option.value = cat;
                option.textContent = cat;
                if(expense.mainCat===cat) option.selected=true;
                mainCatEdit.appendChild(option);
            });
            tdMain.appendChild(mainCatEdit);

            const tdSub = document.createElement("td");
            const subCatEdit = document.createElement("select");
            function updateSubEdit() {
                const subs = categoryMap[mainCatEdit.value];
                subCatEdit.innerHTML="";
                subs.forEach(sub=> {
                    const option = document.createElement("option");
                    option.value=sub;
                    option.textContent=sub;
                    if(expense.subCat===sub) option.selected=true;
                    subCatEdit.appendChild(option);
                });
            }
            updateSubEdit();
            mainCatEdit.addEventListener('change', updateSubEdit);
            tdSub.appendChild(subCatEdit);

            const tdDate = document.createElement("td");
            const dateInputEdit = document.createElement("input");
            dateInputEdit.type="date";
            dateInputEdit.value = expense.date;
            tdDate.appendChild(dateInputEdit);

            const tdActions = document.createElement("td");
            const saveBtn = document.createElement("button");
            saveBtn.textContent="Save";
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent="Delete";
            saveBtn.onclick=()=>{
                expense.name=nameInputEdit.value.trim();
                expense.amount=Math.round(Number(amountInputEdit.value)*100)/100;
                expense.mainCat=mainCatEdit.value;
                expense.subCat=subCatEdit.value;
                expense.date=dateInputEdit.value;
                editingId=null;
                render();
            }
            deleteBtn.onclick=()=>{
                expenses=expenses.filter(e=>e.id!==expense.id);
                editingId=null;
                render();
            }
            tdActions.appendChild(saveBtn);
            tdActions.appendChild(deleteBtn);

            tr.appendChild(tdName);
            tr.appendChild(tdAmount);
            tr.appendChild(tdMain);
            tr.appendChild(tdSub);
            tr.appendChild(tdDate);
            tr.appendChild(tdActions);
        }
        expenseTable.appendChild(tr);
    });
    updateTotal();
    updateCategoryTotals();
    updateBudgetDisplay();
}

function editExpense(id) {
    editingId=id;
    render();
}

function updateTotal() {
    const total = expenses.reduce((sum,e)=>sum+e.amount,0);
    totalSpan.textContent = total.toFixed(2);
}

function updateCategoryTotals() {
    const totals={};
    expenses.forEach(e=>{
        totals[e.mainCat]=(totals[e.mainCat]||0)+e.amount;
    });
    const totalsArray = Object.entries(totals).filter(([cat,amount])=>amount>0).sort((a,b)=>b[1]-a[1]);
    categoryTotalsTable.innerHTML="";
    totalsArray.forEach(([cat,amount])=>{
        const row=document.createElement("tr");
        const categoryCell=document.createElement("td");
        categoryCell.textContent=cat;
        const totalCell=document.createElement("td");
        totalCell.textContent=amount.toFixed(2);
        row.appendChild(categoryCell);
        row.appendChild(totalCell);
        categoryTotalsTable.appendChild(row);
    });
}

function updateBudgetDisplay() {
    const totalExpenses = expenses.reduce((sum,e)=>sum+e.amount,0);
    const remaining = totalBudget - totalExpenses;
    const remainingFormatted = remaining.toFixed(2);
    budgetDisplay.textContent = `Budget: $${remainingFormatted}`;
    budgetDisplay.classList.remove('budget-green','budget-orange','budget-red');

    // Progress bar fill
    let percentSpent = totalExpenses / totalBudget * 100;
    if(percentSpent > 100) percentSpent = 100;
    budgetProgress.style.width = `${percentSpent}%`;

    // Budget color and overlay
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
