const incomeBtn = document.getElementById("add-income-btn");
const expenseBtn = document.getElementById("add-expense-btn");
const incomeTotal = document.getElementById("total-income");
const expenseTotal = document.getElementById("total-expense");
const moneyAvailable = document.getElementById("money-available");
const incomesList = document.getElementById("incomes-list");
const expensesList = document.getElementById("expenses-list");

let totalIncome = 0;
let totalExpense = 0;
let incomes = [];
let expenses = [];

incomeBtn.addEventListener("click", () => {
  const transName = document.getElementById("trans-name").value;
  const transAmount = parseFloat(document.getElementById("trans-amount").value);

  if (transName !== "" && transAmount > 0) {
    totalIncome += transAmount;
    incomeTotal.textContent = totalIncome;
    moneyAvailable.textContent = totalIncome - totalExpense;

    // Save transaction to local storage
    const transaction = {
      name: transName,
      amount: transAmount,
      type: "income"
    };
    incomes.push(transaction);
    localStorage.setItem("incomes", JSON.stringify(incomes));

    // Add transaction to incomes list
    const li = document.createElement("li");
    li.textContent = `${transaction.name} - $${transaction.amount}`;
    incomesList.appendChild(li);
  }

  document.getElementById("trans-name").value = "";
  document.getElementById("trans-amount").value = "";
});

expenseBtn.addEventListener("click", () => {
  const transName = document.getElementById("trans-name").value;
  const transAmount = parseFloat(document.getElementById("trans-amount").value);

  if (transName !== "" && transAmount > 0) {
    totalExpense += transAmount;
    expenseTotal.textContent = totalExpense;
    moneyAvailable.textContent = totalIncome - totalExpense;

    // Save transaction to local storage
    const transaction = {
      name: transName,
      amount: transAmount,
