/*
  The Goal:
  Build a To Do list application that allows you
  to add a new entry, edit an existing entry, and
  remove an existing entry.
 */
const tbodyId = "toDoItems";
const storageKey = "todoItems";
const trTemplateDoc = document.querySelector("#itemTemplate tr");
var todoItems = getItems();
resetForm();

let checkStateInterval = setInterval(() => {
    if (document.readyState === 'complete') {
        clearInterval(checkStateInterval);
        loadItems();
    }
}, 50);


var Task = function Task(value, dueDate, id) {
    this.id = id ? parseInt(id) : new Date().getTime();
    this.name = value;
    this.dueDate = new Date(dueDate);
}

Task.prototype.isValid = function () {
    if (!this.name) {
        alert('please enter proper value in task name')
        return false;
    }
    if (this.dueDate.toString() == "Invalid Date") {
        alert('please enter proper date')
        return false;
    }
    return true;
};

Task.prototype.save = function () {
    if (!this.isValid())
        return;
    var index = getItemIndex(this);
    if (index != -1) {
        var item = todoItems[index];
        item.name = this.name;
        item.dueDate = this.dueDate;
        todoItems[index] = item;
    }
    else {
        todoItems.push(this);
    }
    setItems(todoItems);
};

Task.prototype.remove = function () {
    todoItems.splice(getItemIndex(this), 1);
    setItems(todoItems);
};

function getItemById(itemId) {
    for (var i = 0; i < todoItems.length; i++) {
        var item = todoItems[i];
        if (item.id == itemId) {
            return item;
        }
    }
}

function getItems() {
    const items = localStorage.getItem(storageKey);
    return JSON.parse(items) || [];
}

function setItems(items) {
    todoItems = items;
    localStorage.setItem(storageKey, JSON.stringify(items));
    loadItems();
}

function saveItem() {
    var task = new Task(document.querySelector("#newItemForm #itemName").value,
        document.querySelector("#newItemForm #dueDate").value,
        document.querySelector("#newItemForm #id").value,
    );
    task.save();
    resetForm();
}

function editItem(itemId) {
    const item = getItemById(itemId);
    document.querySelector("#newItemForm #id").value = item.id;
    document.querySelector("#newItemForm #itemName").value = item.name;
    document.querySelector("#newItemForm #dueDate").value = getFormattedDate(new Date(item.dueDate));
    document.querySelector("#newItemForm i").innerHTML = "UPDATE ITEM";
    toggleForm(true);
}

function removeItem(itemId) {
    const entry = getItemById(itemId);
    var item = new Task(entry.name, entry.dueDate, entry.id);
    var confirm = window.confirm("Are you sure want to remove Task '" + item.name + "'?")
    if (confirm) {
        item.remove();
        loadItems();
    }
}

function getFormattedDate(dateObj) {
    return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
}

function resetForm() {
    document.querySelector("#newItemForm #id").value = null;
    document.querySelector("#newItemForm #itemName").value = null;
    document.querySelector("#newItemForm #dueDate").value = getFormattedDate(new Date(new Date().setDate(new Date().getDate() + 3)));
    document.querySelector("#newItemForm i").innerHTML = "CREATE NEW ITEM";
}

function loadItems() {
    var element = document.getElementById(tbodyId);
    element.innerHTML = "";
    for (var i = 0; i < todoItems.length; i++) {
        var item = todoItems[i];
        item = new Task(item.name, item.dueDate, item.id);
        var tr = trTemplateDoc.cloneNode(true);

        tr.querySelector(".item-entry").innerHTML = item.name;

        tr.querySelector(".item-due-date").innerHTML = new Date(item.dueDate).toDateString();

        tr.querySelector(".item-actions").setAttribute("id", item.id);

        tr.querySelector(".item-edit").setAttribute("onclick", "editItem(" + item.id + ")");

        tr.querySelector(".item-delete").setAttribute("onclick", "removeItem(" + item.id + ")");

        element.appendChild(tr);
    }
    if (todoItems.length)
        document.getElementById("noTaskMsg").style.display = "none";
    else
        document.getElementById("noTaskMsg").style.display = "block";
}

function getItemIndex(item) {
    var result = -1;
    if (!todoItems.length)
        return result;
    for (var i = 0; i < todoItems.length; i++) {
        if (item.id == todoItems[i].id) {
            result = i;
            break;
        }
    }
    return result;
}

function saveOnEnter(e) {
    if (e.keyCode == 13) {
        saveItem();
        return false;
    }
}

function toggleForm(openAsShow=false) {
    var newItemForm = document.getElementById("newItemForm");
    var showHideBtn = document.getElementById("showHideForm");
    if (newItemForm.style.display == "none" || openAsShow)
    {
        showHideBtn.innerText = "HIDE TASK FORM";
        newItemForm.style.display = "block";
    }
    else {
        showHideBtn.innerText = "SHOW TASK FORM";
        newItemForm.style.display = "none";
        resetForm();
    }
}

/*
  Step 7 - TAKE IT FURTHER
 */
// Step 7a - Using CSS you learned in your first semester
// style the To Do list to make it nicer than the default
// Bootstrap stylings.

// Step 7b- Hide the 'Create New Item' form.

// Step 7c - Add a button that toggle the 'Create New Item's'
// form visibility.

// Step 7d - Validate the date and alert the user if it is empty.

// Step 7e - Create a way for the user to edit the date:
// INSIGHT: This will take some thought but will demonstrate
// your understanding of JavaScript.

// BONUS: Use prototyping, objects, storage solutions, frameworks,
// and/or date plugins to demonstrate your knowledge and outside
// learning.