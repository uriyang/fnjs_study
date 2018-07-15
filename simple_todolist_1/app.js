//Document is the DOM can be accessed in the console with document.window.
// Tree is from the top, html, body, p etc.

//Problem: User interaction does not provide the correct results.
//Solution: Add interactivity so the user can manage daily tasks.
//Break things down into smaller steps and take each step at a time.


//Event handling, uder interaction is what starts the code execution.

var taskInput = document.getElementById("new-task");//Add a new task.
var addButton = document.getElementsByTagName("button")[0];//first button
var incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks");//completed-tasks

var createNewTaskElement = function (taskString) {
    const li = $.createElement('li');
    const label = $.createElement('label');
    const btn1 = $.createElement('button');
    const btn2 = $.createElement('button');
    const input1 = $.createElement('input');
    const input2 = $.createElement('input');

    $.attr(label, 'innerText', taskString);
    $.attr(input1, 'type', 'checkbox');
    $.attr(input2, 'type', 'text');

    $.attr(btn1, 'classList', 'edit');
    $.attr(btn1, 'innerText', 'Edit');

    $.attr(btn2, 'classList', 'delete');
    $.attr(btn2, 'innerText', 'Delete');
    $.append(li, [input1, label, input2, btn1, btn2]);
    return li;
}


var addTask = function () {
    console.log("Add Task...");
    // 새로운 TODO 생성
    var listItem = createNewTaskElement(taskInput.value);

    // 완료하지 않은 항목에 추가
    $.append(incompleteTaskHolder, listItem);
    bindTaskEvents(listItem, taskCompleted);

    taskInput.value = "";
};

//Edit an existing task.

var editTask = function () {
    console.log("Edit Task...");
    console.log("Change 'edit' to 'save'");


    var listItem = this.parentNode;

    var editInput = listItem.querySelector('input[type=text]');
    var label = listItem.querySelector("label");
    var containsClass = listItem.classList.contains("editMode");
    //If class of the parent is .editmode
    if (containsClass) {

        //switch to .editmode
        //label becomes the inputs value.
        label.innerText = editInput.value;
    } else {
        editInput.value = label.innerText;
    }

    //toggle .editmode on the parent.
    listItem.classList.toggle("editMode");
}


//Delete task.
var deleteTask = function () {
    console.log("Delete Task...");

    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    //Remove the parent list item from the ul.
    ul.removeChild(listItem);

}


//Mark task completed
var taskCompleted = function () {
    console.log("Complete Task...");

    //Append the task list item to the #completed-tasks
    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);

}


var taskIncomplete = function () {
    console.log("Incomplete Task...");
//Mark task as incomplete.
    //When the checkbox is unchecked
    //Append the task list item to the #incomplete-tasks.
    var listItem = this.parentNode;
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
}


var ajaxRequest = function () {
    console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
// $.addOnClick(addButton, addTask);
addButton.addEventListener("click", addTask);
addButton.addEventListener("click", ajaxRequest);


var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
    console.log("bind list item events");

    //select ListItems children and event bind
    $.addOnClick($.selChild(taskListItem, "input[type=checkbox]"), editTask);
    $.addOnClick($.selChild(taskListItem, "button.edit"), deleteTask);
    $.addOnClick($.selChild(taskListItem, "button.delete"), checkBoxEventHandler);
}

//cycle over incompleteTaskHolder ul list items
//for each list item
for (var i = 0; i < incompleteTaskHolder.children.length; i++) {

    //bind events to list items chldren(tasksCompleted)
    bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}


//cycle over completedTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
    //bind events to list items chldren(tasksIncompleted)
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}


// Issues with usabiliy don't get seen until they are in front of a human tester.

//prevent creation of empty tasks.

//Shange edit to save when you are in edit mode.