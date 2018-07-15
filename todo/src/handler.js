export default class Handler {
	constructor($, controller) {
		this.$ = $;
		this.controller = controller;
	}

	updateMode(e) {
		const $EDIT_TEXT_INPUT = $.TODO_LIST.querySelector('.edit');

		if (e.target === $EDIT_TEXT_INPUT) return;

		this.controller.hideEditMode($EDIT_TEXT_INPUT);
		$.BODY.removeEventListener('click', handleUpdateMode);
	}

	input(e) {
		if (e.target.classList.value === 'new-todo') {
			this.controller.addTodo(e);
		}

		if (e.target.classList.value === 'edit') {
			this.controller.updateTodo(e);
		}
	}

	todoListClick({ target }) {
		if (target.classList.value === 'destroy') {
			this.controller.removeTodo(target.parentNode);
		}

		if (target.classList.value === 'toggle') {
			this.controller.toggleState(target);
		}
	}

	clsCompleted() {
		const $completedTodoItem = $.TODO_LIST.querySelectorAll('.completed');

		this.controller.clearCompleted($completedTodoItem);
	}

	filters(target) {
		if (target.tagName !== 'A') return;
		const $FILTERS = $.FILTERS.querySelectorAll('li a');
		const $TODO_LIST = $.TODO_LIST.querySelectorAll('li');

		this.controller.changeFilter($FILTERS, $TODO_LIST, target);
	}

	toggleAll(e) {
		const $TODO_LIST = $.TODO_LIST.querySelectorAll('li');

		this.controller.toggleAll(e.target, $TODO_LIST);
	}

	async todoListDblClick(e) {
		if (e.target.tagName !== 'LABEL') return;
		await controller.showEditMode(e);
		const $EDIT_TEXT_INPUT = $.TODO_LIST.querySelector('.edit');

		$EDIT_TEXT_INPUT.addEventListener('keyup', handleInput);
		$.BODY.addEventListener('click', handleUpdateMode);
	}
}
