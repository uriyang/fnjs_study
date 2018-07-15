import Controller from './controller.js';
import Model from './model.js';
import View from './view.js';
import $ from './element.js';

const model = new Model();
const view = new View($);
const controller = new Controller(view, model);

window.onload = function() {
	controller.init();

	$.NEW_TEXT_INPUT.addEventListener('keyup', handleInput);
	$.TODO_LIST.addEventListener('click', handleListClick);
	$.TODO_LIST.addEventListener('dblclick', handleListDblClick);
	$.CLS_COMPLETED.addEventListener('click', handleClsCompleted);
	$.FILTERS.addEventListener('click', handleFilters);
	$.TOGGLE_ALL.addEventListener('click', handleToggleAll);
};

const handleUpdateMode = e => {
	const $EDIT_TEXT_INPUT = $.TODO_LIST.querySelector('.edit');

	if (e.target === $EDIT_TEXT_INPUT) return;

	controller.hideEditMode($EDIT_TEXT_INPUT);
	$.BODY.removeEventListener('click', handleUpdateMode);
};

const handleInput = e => {
	e.preventDefault();
	if (e.target.classList.value === 'new-todo') {
		controller.addTodo(e);
	}

	if (e.target.classList.value === 'edit') {
		controller.updateTodo(e);
	}
};

const handleListClick = ({ target }) => {
	if (target.classList.value === 'destroy') {
		controller.removeTodo(target.parentNode);
	}

	if (target.classList.value === 'toggle') {
		controller.toggleState(target);
	}
};

const handleClsCompleted = () => {
	const $COMPLETED_TODO = $.TODO_LIST.querySelectorAll('.completed');

	controller.clearCompleted($COMPLETED_TODO);
};

const handleFilters = ({ target }) => {
	if (target.tagName !== 'A') return;
	const $FILTERS = $.FILTERS.querySelectorAll('li a');
	const $TODO_LIST = $.TODO_LIST.querySelectorAll('li');

	controller.changeFilter($FILTERS, $TODO_LIST, target);
};

const handleToggleAll = e => {
	const $TODO_LIST = $.TODO_LIST.querySelectorAll('li');

	controller.toggleAll(e.target, $TODO_LIST);
};

const handleListDblClick = async e => {
	if (e.target.tagName !== 'LABEL') return;
	await controller.showEditMode(e);
	const $EDIT_TEXT_INPUT = $.TODO_LIST.querySelector('.edit');

	$EDIT_TEXT_INPUT.addEventListener('keyup', handleInput);
	$.BODY.addEventListener('click', handleUpdateMode);
};
