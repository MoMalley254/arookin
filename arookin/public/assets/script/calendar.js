// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// Initialize Firebase Authentication
// firebase.initializeApp(firebaseConfig)
// const auth = firebase.auth();

// Get a reference to the Firebase database
// const db = firebase.database();

// const listsRef = firebase.database().ref(`users/${uid}/lists`);
// listsRef.once('value')
//   .then(snapshot => {
//     if (!snapshot.exists()) {
//       listsRef.set({
//         // any initial data you want to set for the lists node
//       });
//     }
//   })
//   .catch(error => {
//     // handle any errors here
//   });

// Add a user authentication listener
// auth.onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in
//     const userId = user.uid;
//     const userRef = db.ref("users/" + userId);

//     // Store the user's lists in Firebase
//     // userRef.child("lists").set(lists);

//     // Read the user's lists from Firebase
//     userRef.child("lists").on("value", (snapshot) => {
//       lists = snapshot.val() || [];

//       // Show the plan
//       showPlan();
//     });
//   } else {
//     // User is signed out
//     lists = [];
//     selectedListId = null;
//     showPlan();
//   }
// });


const listContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-create-list-form]')
const newListInput = document.querySelector('[data-create-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const taskMajorContainer = document.querySelector('[data-task-container]')
const listContainerName = document.querySelector('[data-list-title]')
const taskCount = document.querySelector('[data-task-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInputName = document.querySelector('[data-new-task-input-name]')
const newTaskInputDeadline = document.querySelector('[data-new-task-input-deadline]')
const deleteCompleteTasksButton = document.querySelector('[data-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'plan.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'plan.selectedListIdId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndShowPlan()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        showRemainingTasks(selectedList)
    }
})

deleteCompleteTasksButton.addEventListener('click', e => {
    const response = confirm("Proceed to delete complete tasks?");
    if(response) {
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
        saveAndShowPlan()
        alert('Complete Tasks deleted.')
    } else {
        alert("Complete Tasks NOT Deleted")
    }
    
})

deleteListButton.addEventListener('click', e => {
    const response = confirm("Proceed to delete this Task Group?");
    if(response) {
        lists = lists.filter(list => list.id !== selectedListId)
        selectedListId = null
        saveAndShowPlan()
        alert('Task Group deleted.')
    } else {
        alert("Task Group NOT Deleted")
    }
    
})


newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName == '') {
        alert( 'List Name Cannot be empty')
        return
    }
    const list = createList(listName)
    alert('Task Group ('+listName+') created.')
    newListInput.value = null
    lists.push(list)
    saveAndShowPlan()

    // Save the new list to Firebase
    // db.ref('lists').push(list);
})

function createList(name) {
   return { id: Date.now().toString(), name:name, tasks: []  }
}

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInputName.value
    // const taskDeadline = newTaskInputDeadline.value
    if (taskName == null || taskName == '') {
        alert( 'Task name not given,please fill in the task name')
        // if (taskDeadline == null || taskDeadline == '') {
        //     alert( 'Task deadline not given,please fill in the task deadline')
        // }
        return
    }
    const task = createTask(taskName)
    alert('Task ('+taskName+') created.')
    newTaskInputName.value = null
    // newTaskInputDeadline.value = null
    // newTaskInputDeadline.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndShowPlan()


    // Save the new task to Firebase
    // db.ref('lists/' + selectedListId + '/tasks').push(task);
        
})
function createTask(name) {
    return { id: Date.now().toString(), name:name,  complete: false }
}


function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY,selectedListId)

    if (auth.currentUser) {
        // Store the user's data in Firebase
        const userId = auth.currentUser.uid;
        const userRef = db.ref("users/" + userId + "plans");
        userRef.child("lists/" + selectedListId).set(
          lists.find((list) => list.id === selectedListId)
        )
        console.log("Saved to Firebase");
      }
    //TO-DO
}

function saveAndShowPlan() {
    save()
    showPlan()
}

function showPlan() {
    clearElement(listContainer)
    showLists() 

    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        taskMajorContainer.style.display = 'none'
    } else {
        taskMajorContainer.style.display = ''
        listContainerName.innerText = selectedList.name
        showRemainingTasks(selectedList)
        clearElement(tasksContainer)
        showTasks(selectedList)
    }
}

function showTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function showRemainingTasks(selectedList) {
    const incompleteTasks = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasks === 1 ? "task" : "tasks"
    taskCount.innerText = `${incompleteTasks} ${taskString} remaining`
    // console.log(taskCount)
    // taskCount.innerText = `${incompleteTasks} ${taskString} remaining`
}

function showLists() {
    lists.forEach(list => {
        const listItem = document.createElement('li')
        listItem.dataset.listId = list.id
        listItem.classList.add("list-item")
        listItem.innerText = list.name
        if (list.id === selectedListId) {
            listItem.classList.add('active')
        }
        listContainer.appendChild(listItem)
    })
}
function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

showPlan()
//Calendar



