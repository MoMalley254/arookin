let transact = { incomesArray: [], expensesArray: [] };
let transactTotals = { totalIncome: 0, totalExpense: 0, availableBudget: 0 };

// get data from localStorage
if (localStorage.getItem("transact")) {
  transact = JSON.parse(localStorage.getItem("transact"));
}
if (localStorage.getItem("transactTotals")) {
  transactTotals = JSON.parse(localStorage.getItem("transactTotals"));
}

// update the UI with the stored data
function updateUI() {
  document.getElementById("incomeList").innerHTML = "";
  document.getElementById("expenseList").innerHTML = "";

  // add incomes to the UI
  transact.incomesArray.forEach((income) => {
    let li = document.createElement("li");
    li.innerHTML = `${income.description} - ${income.amount}`;
    document.getElementById("incomeList").appendChild(li);
  });

  // add expenses to the UI
  transact.expensesArray.forEach((expense) => {
    let li = document.createElement("li");
    li.innerHTML = `${expense.description} - ${expense.amount}`;
    document.getElementById("expenseList").appendChild(li);
  });

  // update the budget totals
  document.getElementById("totalIncome").innerHTML = transactTotals.totalIncome;
  document.getElementById("totalExpense").innerHTML = transactTotals.totalExpense;
  document.getElementById("availableBudget").innerHTML = transactTotals.availableBudget;
}

// add income
document.getElementById("addIncome").addEventListener("click", () => {
  let incomeDesc = document.getElementById("incomeDesc").value;
  let incomeAmount = parseInt(document.getElementById("incomeAmount").value);

  if (!incomeDesc || !incomeAmount) {
    alert("Please provide both description and amount for income.");
    return;
  }

  // add income to transact array
  transact.incomesArray.push({ id: Date.now(), description: incomeDesc, amount: incomeAmount });

  // update total income and available budget
  transactTotals.totalIncome += incomeAmount;
  transactTotals.availableBudget += incomeAmount;

  // update localStorage
  localStorage.setItem("transact", JSON.stringify(transact));
  localStorage.setItem("transactTotals", JSON.stringify(transactTotals));

  // update the UI
  updateUI();

  // clear input fields
  document.getElementById("incomeDesc").value = "";
  document.getElementById("incomeAmount").value = "";
});

// add expense
document.getElementById("addExpense").addEventListener("click", () => {
  let expenseDesc = document.getElementById("expenseDesc").value;
  let expenseAmount =
