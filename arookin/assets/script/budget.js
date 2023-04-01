// ITEM CONTROLLER
const incomeTotal = document.querySelector('[data-income-amount-total]')
const availableTotal = document.querySelector('[data-available-amount-total]')
const expenseTotal = document.querySelector('[data-expense-amount-total]')
const inputName = document.querySelector('[data-input-amount-name]')
const inputAmount = document.querySelector('[data-input-amount-number]')
const inputAmountIncomeBtn = document.querySelector('[data-add-income-button]')
const inputAmountExpenseBtn = document.querySelector('[data-add-expense-button]')
const moneyItemsContainer = document.querySelector('[data-transacts-container]')
const moneyItemsIncomesContainer = document.querySelector('[data-income-container]')
const moneyItemsExpensesContainer = document.querySelector('[data-expense-container]')

const LOCAL_STORAGE_INCOME_ITEMS_KEY = 'transaction.incomes'
const LOCAL_STORAGE_EXPENSE_ITEMS_KEY = 'transaction.expenses'
const LOCAL_STORAGE_AVAILABLE_AMOUNT_KEY = 'transaction.available'

let incomeItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INCOME_ITEMS_KEY)) || []
let expenseItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_EXPENSE_ITEMS_KEY)) || []
let availableAmount = parseFloat(localStorage.getItem(LOCAL_STORAGE_AVAILABLE_AMOUNT_KEY)) || 0



// Load data from local storage
const loadIncomeFromLocalStorage = function () {
  const incomeFromLocalStorage = localStorage.getItem("transaction.incomes");
  if (incomeFromLocalStorage !== null) {
    incomeItems = JSON.parse(incomeFromLocalStorage);
    // incomeItems.forEach(item => {
    //   console.log(item)
    //    item = {
    //     name: incomeItems.name ,
    //     amount: incomeItems.amount
    //   }
    // });
    // addItem(incomeItems);
    // addToIncome(incomeItems);
    updateIncomeTotal();
  }
};

const loadExpenseFromLocalStorage = function () {
  const expenseFromLocalStorage = localStorage.getItem("transaction.expenses");
  if (expenseFromLocalStorage !== null) {
    expenseItems = JSON.parse(expenseFromLocalStorage);
    // let item = {
    //   name:expenseItems.name ,
    //   amount:expenseItems.amount
    // };
    // addToExpense(expenseItems);
    updateExpenseTotal();
  }
};

const loadAvailableAmountFromLocalStorage = function () {
  const availableFromLocalStorage = localStorage.getItem("transaction.available");
  if (availableFromLocalStorage !== null) {
    availableAmount = parseFloat(availableFromLocalStorage);
    updateAvailableTotal();
  }
};
// Check local storage for data
loadIncomeFromLocalStorage();
loadExpenseFromLocalStorage();
loadAvailableAmountFromLocalStorage();

inputAmountIncomeBtn.addEventListener('click', () => {
  addItemIncome()
})

inputAmountExpenseBtn.addEventListener('click', () => {
  addItemExpense()
})

function addItemIncome() {
  const name = inputName.value
  const amount = parseFloat(inputAmount.value)
  if (isNaN(amount) || name === '') {
    alert('Please fill in transaction name')
  } 
  const item = { name, amount }
  if (amount > 0) {
    incomeItems.push(item)
    addToIncome(item)
  } 
  updateLocalStorage()
  clearInputs()
}

function addItemExpense() {
  const name = inputName.value
  const amount = parseFloat(inputAmount.value)
  if (isNaN(amount) || name === '') return

  const item = { name, amount }
  if (amount > 0) {
    expenseItems.push(item)
    addToExpense(item)
  }
  updateLocalStorage()
  clearInputs()
}


function clearInputs() {
  inputName.value = ''
  inputAmount.value = ''
}

function addToIncome(item) {
  const listItem = document.createElement('div')
  listItem.classList.add('item','transaction-item', 'income')
  listItem.innerHTML = `
  <h5 class="item-name" data-income-item-name>${item.name}</h5>
  <span id="incomeAmount" class="income__amount" data-income-item-amount>+${item.amount}</span>
    <button onclick="removeItem(this)">
        <i class="bi bi-trash3-fill" data-delete-item></i>
    </button>
  `
  moneyItemsIncomesContainer.append(listItem)
  updateIncomeTotal()
}

function addToExpense(item) {
  const listItem = document.createElement('div')
  listItem.classList.add('item','transaction-item', 'expense')
  listItem.innerHTML = `
    <h5 class="item-name" data-expense-item-name>${item.name}</h5>
    <span id="expenseAmount" class="expense__amount" data-expense-item-amount>${item.amount}</span>
    <button onclick="removeItem(this)">
      <i class="bi bi-trash3-fill" data-delete-item></i>
    </button>
  `
  moneyItemsExpensesContainer.append(listItem)
  updateExpenseTotal()
}

function removeItem(element) {
  const listItem = element.closest('.transaction-item')
  const isIncome = listItem.classList.contains('income')
  if (isIncome) {
    incomeItems = incomeItems.filter((item) => item.name !== listItem.querySelector('[data-income-item-name]').textContent || item.amount !== parseFloat(listItem.querySelector('[data-income-item-amount]').textContent.substring(1)))
    updateIncomeTotal()
  } else {
    expenseItems = expenseItems.filter((item) => item.name !== listItem.querySelector('[data-expense-item-name]').textContent || item.amount !== parseFloat(listItem.querySelector('[data-expense-item-amount]').textContent))
    updateExpenseTotal()
  }
  listItem.remove()
  updateLocalStorage()
}


function updateIncomeTotal() {
  const income = incomeItems.reduce((total, item) => {
    return total + item.amount
  }, 0)
  incomeTotal.innerText = `+${income.toFixed(2)}`
  updateAvailableTotal(income)
}

function updateExpenseTotal() {
  const expense = expenseItems.reduce((total, item) => {
    return total + item.amount
  }, 0)
  expenseTotal.innerText = `-${expense.toFixed(2)}`
  updateAvailableTotal(-expense)
}

function updateAvailableTotal() {
  const income = incomeItems.reduce((total, item) => {
    return total + item.amount
  }, 0)
  
  const expense = expenseItems.reduce((total, item) => {
    return total + item.amount
  }, 0)

  const available = income - expense
  availableTotal.innerText = `${available.toFixed(2)}`
  localStorage.setItem(LOCAL_STORAGE_AVAILABLE_AMOUNT_KEY, available)
  
  if (available < 0) {
    availableTotal.classList.add('negative')
    availableTotal.style.color = "yellow"
  } else {
    availableTotal.classList.remove('negative')
    availableTotal.style.color = "green"
  }

  return available
}

function updateLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_INCOME_ITEMS_KEY, JSON.stringify(incomeItems))
  localStorage.setItem(LOCAL_STORAGE_EXPENSE_ITEMS_KEY, JSON.stringify(expenseItems))
  localStorage.setItem(LOCAL_STORAGE_AVAILABLE_AMOUNT_KEY, JSON.stringify(availableAmount))
}

const available = updateAvailableTotal()

//Uploading to Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCO5R_R3S8XNmMRr08Bw2mFjPWCdBrAP5o",
  authDomain: "arookin-0.firebaseapp.com",
  projectId: "arookin-0",
  storageBucket: "arookin-0.appspot.com",
  messagingSenderId: "274330650351",
  appId: "1:274330650351:web:32225d7b3f4044d0d67d1a",
  measurementId: "G-M0B9YF584W"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    // Database ref to specific user
    const userRef = firebase.database().ref('users/' + uid);
    
    const data = {
      incomeTotal: {
        amount: incomeTotal.innerText
      },
      availableTotal: {
        amount: available
      },
      expenseTotal: {
        amount: expenseTotal.innerText
      },
      incomeItems: incomeItems,
      expenseItems: expenseItems,
      availableAmount: available
    };

    // upload the data to the user's location in the database
    userRef.set(data);
  } else {
    // handle the case where the user is not signed in
  }
});