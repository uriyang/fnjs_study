(function init() {
  var todo_add = getElementByClass('todo-add');
  todo_add.addEventListener('click', function (e) {
    addTodo();
  });
})();

function makeElement(tag) {
  return _use_method(document, 'createElement', tag);
}

// 0: 부모 태그, 1 ~: 자식 태그
function makeElementSet() {
  var args = slice.call(arguments, 0);
  var parent = args[0];
  var child = _rest(args);
  _each(child, function (node) { parent.appendChild(node) });
  return parent;
}

function getElementByClass(tag) {
  return _use_method(document, 'getElementsByClassName', tag)[0];
}

function newTodo(message) {
  var todo_item = makeElement('LI');
    todo_item.className = 'todo-item';

  var todo_message = makeElement('SPAN');
    todo_message.textContent = message;
    todo_message.className = 'todo-message';
    todo_message.setAttribute('data-is-completed', 0);
    todo_message.addEventListener('click', function (e) {
      completeTodo(this);
    });


  var edit_icon = makeElement('I');
    edit_icon.className = 'far fa-edit';

  var todo_update = makeElement('BUTTON');
    todo_update.type = 'button';
    todo_update.className = 'todo-update';
    todo_update.appendChild(edit_icon);
    todo_update.addEventListener('click', function (e) {
      openModal(this, updateTodo);
    });

  var todo_delete = makeElement('BUTTON');
    todo_delete.type = 'button';
    todo_delete.className = 'todo-delete';
    todo_delete.textContent = '⨯'; 
    todo_delete.addEventListener('click', function (e) {
      deleteTodo(this);
    });

  return makeElementSet(todo_item, todo_message, todo_update, todo_delete);    
}

function addTodo() {
  var todo_list = getElementByClass('todo-list');
  var input = getElementByClass('todo-input');
  var message = input.value;
  var todo = newTodo(message);
  todo_list.appendChild(todo);
  input.value = '';
}

function completeTodo(node) {
  var todo_list = getElementByClass('todo-list');
  var complete_list = getElementByClass('complete-list');
  
  var isCompleted = node.dataset.isCompleted;
  var classList = node.classList;
  var todo = node.parentNode;
  
  if (Number(isCompleted)) {
    node.dataset.isCompleted = 0;
    classList.remove('todo-complete');
    todo_list.appendChild(todo);
  } else {
    node.dataset.isCompleted = 1;
    classList.add('todo-complete');
    complete_list.appendChild(todo);
  }
}

function updateTodo(node, msg, modal) {
  node.textContent = msg;
  modal.style.visibility = 'hidden';
}

function deleteTodo(node) {
  var todo = node.parentNode;
  var list = todo.parentNode;
  list.removeChild(todo);
}

function openModal(node, fn) {
  var modal = getElementByClass('modal'),
      input = getElementByClass('modal-input'),
      update = getElementByClass('modal-update'),
      cancel = getElementByClass('modal-cancel');
  var todo_message = node.parentNode.firstChild;
  var message = todo_message.textContent;
  input.value = message;
  modal.style.visibility = 'visible';

  update.addEventListener('click', function (e) {
    var target = this.parentNode.children[0];
    var newMsg = target.value;
    fn(todo_message, newMsg, modal);
  });

  cancel.addEventListener('click', function (e) {
    closeModal();
  });
}

function closeModal() {
  var modal = getElementByClass('modal');
  modal.style.visibility = 'hidden';  
}