import { fetchData, putData, updateData, deleteData } from './api.js';

export default class Controller {
	constructor(view, model) {
		this.view = view;
		this.model = model;
		this.URL = 'https://mock-data-12c45.firebaseio.com';
	}

	async init() {
		const _ = this;

		await _.loadTodoData();
		const todo = await _.model.getTodoList();
		const getTodoLength = status => _.model.getTodoLength(status);
		const isActiveCount = getTodoLength(false);
		const isCompletedCount = getTodoLength(true);

		await _.view.init(todo);
		_.toggleFooter();
		_.view.updateTodoCount(isActiveCount);
		_.toggleClsCompleted();
	}

	async loadTodoData() {
		const result = await fetchData(`${this.URL}/todo.json`);

		this.mappingTodoData(result);
	}

	mappingTodoData(todo) {
		this.model.setTodoList(todo);
	}

	async addTodo({ target: $NEW_TEXT_INPUT, keyCode }) {
		if (keyCode !== 13 || !$NEW_TEXT_INPUT.value) return;
		console.log('adasdas');

		const _ = this;
		const todoList = _.model.getTodoList();
		const newTodo = {
			content: $NEW_TEXT_INPUT.value,
			completed: false,
		};
		const newTodoId = await putData(`${this.URL}/todo.json`, newTodo);
		newTodo.id = newTodoId;

		_.model.addTodo(newTodo);
		_.view.addTodo(newTodo);
		_.toggleFooter();

		const activeCount = _.model.getTodoLength(false);
		_.view.updateTodoCount(activeCount);

		$NEW_TEXT_INPUT.value = '';
	}

	removeTodo($LI) {
		const _ = this;
		const selectedId = $LI.id;
		const todoList = _.model.getTodoList();

		for (const id in todoList) {
			if (selectedId === id) {
				deleteData(`${this.URL}/todo/${id}.json`);
			}
		}

		// _.model.removeTodo(selectedId);
		_.view.removeTodo($LI);
		_.toggleFooter();

		const activeCount = _.model.getTodoLength(false);
		_.view.updateTodoCount(activeCount);
		_.toggleClsCompleted();
	}

	showEditMode(e) {
		this.view.showEditMode(e);
	}

	updateTodo({ target: $EDIT_TEXT_INPUT, keyCode }) {
		if (keyCode !== 13 || !$EDIT_TEXT_INPUT.value) return;
		const _ = this;
		const $LI = $EDIT_TEXT_INPUT.parentNode;
		const todoList = _.model.getTodoList();
		const $label = $LI.querySelector('label');

		for (const id in todoList) {
			if (id === $LI.id) {
				updateData(`${this.URL}/todo.json`, {
					[id]: {
						...todoList[id],
						content: $EDIT_TEXT_INPUT.value,
					},
				});
				_.model.updateTodo(id, $EDIT_TEXT_INPUT.value);
				$label.textContent = $EDIT_TEXT_INPUT.value;
				_.view.hideEditMode($EDIT_TEXT_INPUT, $label);
			}
		}
	}

	hideEditMode($EDIT_TEXT_INPUT) {
		this.view.hideEditMode(
			$EDIT_TEXT_INPUT,
			$EDIT_TEXT_INPUT.parentNode.querySelector('label'),
		);
	}

	toggleState(target, status = undefined) {
		const _ = this;
		const $LI = status === undefined ? target.parentNode : target;
		const id = Number($LI.id);
		const todoList = _.model.getTodoList();
		const targetIndex = todoList.findIndex(todo => todo.id === id);

		_.model.toggleState(targetIndex, status);
		_.toggleClsCompleted();

		const activeCount = _.model.getTodoLength(false);

		_.view.toggleState($LI, id);
		_.view.updateTodoCount(activeCount);
		status === undefined && _.view.toggleToggleAllBtn(false);
	}

	clearCompleted($COMPLETED_TODO) {
		[...$COMPLETED_TODO].map($TODO => this.removeTodo($TODO));
	}

	toggleFooter() {
		const _ = this;
		const isTodoList = !!_.model.getTodoLength() ? 'block' : 'none';

		_.view.toggleFooter(isTodoList);
	}

	toggleClsCompleted() {
		const _ = this;
		const getTodoLength = status => _.model.getTodoLength(status);
		const isCompletedCount = getTodoLength(true);

		_.view.toggleClsCompleted(isCompletedCount >= 1 ? 'block' : 'none');
	}

	changeFilter($FILTERS, $TODO_LIST, $SELECTED_BTN) {
		const [selectedState] = $SELECTED_BTN.href.split('/').slice(-1);

		[...$FILTERS].map($A => {
			$A.classList.value === 'selected' && this.view.removeSelectedFilter($A);
		});

		[...$TODO_LIST].map($LI => {
			let result = 'list-item';
			if (selectedState === 'active') {
				result = $LI.classList.value === 'completed' ? 'none' : 'list-item';
			}
			if (selectedState === 'completed') {
				result = $LI.classList.value === 'completed' ? 'list-item' : 'none';
			}
			this.view.toogleDisplay($LI, result);
		});
		this.view.addSelectedFilter($SELECTED_BTN);
	}

	toggleAll($TOGGLE_ALL, $TODO_LIST) {
		const isChecked = $TOGGLE_ALL.checked;
		const isCompletedList = $LI =>
			isChecked
				? $LI.classList.value !== 'completed'
				: $LI.classList.value === 'completed';

		[...$TODO_LIST].filter(isCompletedList).map($LI => {
			this.toggleState($LI, isChecked);
			this.view.toggleChecked($LI.querySelector('.toggle'), isChecked);
		});
	}
}
