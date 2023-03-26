//Try 3


//ITEM CONTROLLER
const itemCtrl = (function(){
    //item contructor
    const Item = function(id, description, amount, type=null){
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.type = type;
    }
    
    //data structure
    const data = {
        items:[]
    }

    // Save data to local storage
    const saveToLocalStorage = function(data) {
        localStorage.setItem('data', JSON.stringify(data));
    };

    //public methods
    return{
        logData: function(){
            return data;
        },
        addMoney: function(description, amount, type){
            //create random id
            let ID = itemCtrl.createID();
            //create new item
            newMoney = new Item(ID, description, amount, type);
            //push it into the array
            data.items.push(newMoney);

            // Save data to local storage
            saveToLocalStorage(data);

            return newMoney;
        },
        createID: function(){
            //create random id number between 0 and 10000
            const idNum = Math.floor(Math.random()*10000);
            return idNum;
        },
        getIdNumber: function(item){
            //get the item id
            const amountId = (item.parentElement.id);
            //break the id into an array
            const itemArr = amountId.split('-');
            //get the id number
            const id = parseInt(itemArr[1]);

            return id;
        },
        deleteAmountArr: function(id){
            //get all the ids
            const ids = data.items.map(function(item){
                //return item with id
                return item.id
            });
            //get index
            const index = ids.indexOf(id)
            //remove item
            data.items.splice(index, 1);

            // Save data to local storage
            saveToLocalStorage(data);
        }
    }
})();



//UI CONTROLLER
const UICtrl = (function(){
    //ui selectors
    const UISelectors = {
        incomeBtn: '#addIncome',
        expenseBtn: '#addExpense',
        description: '#transactName',
        amount: '#transactAmount',
        moneyEarned: '#money-earned',
        moneyAvailable: '#money-available',
        moneySpent: '#money-expense',
        incomeList: '#incomeItem',
        expensesList: '#expenseItem',
        incomeItem: '.income__amount',
        expenseItem: '.expense__amount',
        itemsContainer: '.money-items'
    }
    //public methods
    return{
        //return ui selectors
        getSelectors: function(){
            return UISelectors
        },
        getDescriptionInput: function(){
            return {
                descriptionInput: document.querySelector(UISelectors.description).value
            }
        },
        getValueInput: function(){
            return{
                amountInput: document.querySelector(UISelectors.amount).value
            }
        },
        addIncomeItem: function(item){
            
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'item'
            //add id to the item
            div.id = `item-${item.id}`
            div.description = `${item.description}`
            div.amount = `${item.amount}`
            //add html
            div.innerHTML = `
            <h5 class="item-name" data-income-item-name>${item.description}</h5>
            <span id="incomeAmount" class="income__amount" data-income-item-amount>${item.amount}</span>
            <button>
                <i class="bi bi-trash3-fill" data-delete-item></i>
            </button>
            `;
            
            //insert income into the list
            document.querySelector(UISelectors.incomeList).insertAdjacentElement('beforeend', div);

            
        },
        clearInputs: function(){
            document.querySelector(UISelectors.description).value = ''
            document.querySelector(UISelectors.amount).value = ''
        },
        updateEarned: function(){
            //all income elements
            const allIncome = document.querySelectorAll(UISelectors.incomeItem);
            //array with all incomes
            const incomeCount = [...allIncome].map(item => +item.innerHTML);
            //calculate the total earned
            const incomeSum = incomeCount.reduce(function(a,b){
                return a+b
            },0);
            //display the total earned
            const earnedTotal = document.querySelector(UISelectors.moneyEarned).innerHTML = incomeSum.toFixed(2);
            // console.log(earnedTotal)
        },
        addExpenseItem: function(item){
           
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'item'
            //add id to the item
            div.id = `item-${item.id}`
            //add html
            div.innerHTML = `
            <h5 class="item-name" data-expense-item-name>${item.description}</h5>
            <span id="expenseAmount" class="expense__amount" data-expense-item-amount>${item.amount}</span>
            <button>
                <i class="bi bi-trash3-fill" data-delete-item></i>
            </button>
            `;
            //insert income into the list
            document.querySelector(UISelectors.expensesList).insertAdjacentElement('beforeend', div);
            
        },
        updateSpent: function(){
            //all expenses elements
            const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
            //array with all expenses
            const expenseCount = [...allExpenses].map(item => +item.innerHTML)
            //calculate the total
            const expenseSum = expenseCount.reduce(function(a, b){
                return a+b
            },0)
            // display the total spent
            const expensesTotal = document.querySelector(UISelectors.moneySpent).innerHTML = expenseSum;
        },
        updateAvailable: function(){
            const earned = document.querySelector(UISelectors.moneyEarned);
            const spent = document.querySelector(UISelectors.moneySpent)
            const available = document.querySelector(UISelectors.moneyAvailable);
            available.innerHTML = ((+earned.innerHTML)-(+spent.innerHTML)).toFixed(2)
        },
        deleteAmount: function(id){
            //create the id we will select
            const amountId = `#item-${id}`;
            //select the amount with the id we passed
            const amountDelete = document.querySelector(amountId);
            //remove from ui
            amountDelete.remove();
        }
    }
})();

//APP CONTROLLER
const App = (function(){
    //event listeners
    const loadEventListeners = function(){
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();
        //add new income
        document.querySelector(UISelectors.incomeBtn).addEventListener('click', addIncome);
        //add new expense
        document.querySelector(UISelectors.expenseBtn).addEventListener('click', addExpense);
        //delete item
        document.querySelector(UISelectors.itemsContainer).addEventListener('click', deleteItem);
    }

    //add new income
    const addIncome = function(){
        //get description and amount values
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //if inputs are not empty
        if(description.descriptionInput !=='' && amount.amountInput !== ''){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput, "income");
            //add item to the list
            UICtrl.addIncomeItem(newMoney);
            //clear inputs
            UICtrl.clearInputs();
            //update earned
            UICtrl.updateEarned();
            //calculate money available
            UICtrl.updateAvailable();

            //CREATE NEW OBJECT
            const incomeItemsObj = [{
                // id:item.id,
                description:description.descriptionInput,
                amount:amount.amountInput
            }]
            //PUSH INTO OBJECT
            // incomeItemsObj.push(div)
            console.log(incomeItemsObj)
        }
    }

    //add new expense
    const addExpense = function(){
        //get description and amount values
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //if inputs are not empty
        if(description.descriptionInput !=='' && amount.amountInput !== ''){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput, "expense");
            //add item to the list
            UICtrl.addExpenseItem(newMoney);
            //clear inputs
            UICtrl.clearInputs();
            //update total spent
            UICtrl.updateSpent();
            //calculate money available
            UICtrl.updateAvailable();
        }
    }

    //delete item
    const deleteItem = function(e){
        if(e.target.classList.contains('bi')){
            //get id number
            const id = itemCtrl.getIdNumber(e.target)
            //delete amount from ui
            UICtrl.deleteAmount(id);
            //delete amount from data
            itemCtrl.deleteAmountArr(id);
            //update earned
            UICtrl.updateEarned();
            //update total spent
            UICtrl.updateSpent();
            //calculate money available
            UICtrl.updateAvailable();
        }

        e.preventDefault()
    }

    //init function
    return{
        init: function(){
            loadEventListeners();
        }
    }

})(itemCtrl, UICtrl);

App.init();

// //Get transactions from local storage
// let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// let totalIncome = 0;
// let totalExpense = 0;
// const totalIncomeElement = document.getElementById("money-earned");
// const totalExpenseElement = document.getElementById("money-expense");
// const moneyAvailableElement = document.getElementById("money-available");
// const addIncomeButton = document.getElementById("addIncome");
// const addExpenseButton = document.getElementById("addExpense");

// // // Function to save the transactions to local storage
// // function saveTransactions() {
// //     localStorage.setItem("transactions", JSON.stringify(transactions));
// //   }

// // // Function to add a transaction to the list
// // function addTransaction(name, amount, type) {
// //     const transaction = { name, amount, type };
// //     transactions.push(transaction);
// //     saveTransactions();
// //     displayTransactions();
// //   }

// addIncomeButton.addEventListener("click", function(){
//     const transactionName = document.getElementById("transactName").value;
//     const transactionAmount = parseFloat(document.getElementById("transactAmount").value);
//     if(transactionName && transactionAmount){
//         totalIncome += transactionAmount;
//         totalIncomeElement.innerText = totalIncome;

//         const incomeTransaction = {
//             name: transactionName,
//             amount: transactionAmount
//         }
//         localStorage.setItem("IncomeTransaction", JSON.stringify(incomeTransaction))
//                 console.log(incomeTransaction)


//         updateMoneyAvailable();
//         resetInputFields();

        
//         // saveIncomesToLocalStorage(incomeTransaction) {
//         //         localStorage.setItem("IncomeTransaction", JSON.stringify(incomeTransaction))
//         //         console.log(incomeTransaction)
//         //     }
//         // };
//     }
// });

// function saveIncomesToLocalStorage() {
    

// addExpenseButton.addEventListener("click", function(){
//     const transactionName = document.getElementById("transactName").value;
//     const transactionAmount = parseFloat(document.getElementById("transactAmount").value);
//     if(transactionName && transactionAmount){
//         totalExpense += transactionAmount;
//         totalExpenseElement.innerText = totalExpense;
//         updateMoneyAvailable();
//         resetInputFields();
//     }
// });

// function updateMoneyAvailable(){
//     const moneyAvailable = totalIncome - totalExpense;
//     moneyAvailableElement.innerText = moneyAvailable;
// }

// function resetInputFields(){
//     document.getElementById("transactName").value = "";
//     document.getElementById("transactAmount").value = "";
// }

// // const totalIncome = document.querySelector('[data-income-amount-total]')
// // const availableAmount = document.querySelector('[data-available-amount-total]')
// // const totalExpense = document.querySelector('[data-expense-amount-total]')

// // const inputForm = document.querySelector('[data-input-amount-form]')
// // const inputFormName = document.querySelector('[data-input-amount-name]')
// // const inputFormAmount = document.querySelector('[data-input-amount-number]')

// // const addIncomeButton = document.querySelector('[data-add-income-button]')
// // const addExpenseButton = document.querySelector('[data-add-expense-button]')

// // const transactionsContainer = document.querySelector('[data-transacts-container]')
// // const incomeTransactionsContainer = document.querySelector('[data-income-container]')
// // const singleIncomeTransaction = document.querySelector('[data-income-single-item]')
// // const singleIncomeTransactionName = document.querySelector('[data-income-item-name]')
// // const singleIncomeTransactionAmount = document.querySelector('[data-income-item-amount]')

// // const expenseTransactionsContainer = document.querySelector('[data-expense-container]')
// // const singleExpenseTransaction = document.querySelector('[data-expense-single-item]')
// // const singleExpenseTransactionName = document.querySelector('[data-expense-item-name]')
// // const singleExpenseTransactionAmount = document.querySelector('[data-expense-item-amount]')

// // const deleteTransaction = document.querySelector('[data-delete-item]')

// // inputForm.addEventListener('submit', e => {
// //     e.preventDefault()
// //     const transactionName = inputFormName.value
// //     if (transactionName == null || transactionName == '') {
// //         alert( 'List Name Cannot be empty')
// //         return
// //     }
// // })