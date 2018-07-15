export default class Model {
	getTodoList(id) {
		return id ? this.todoList[id] : this.todoList;
	}

	getTodoLength(status = 'All') {
		const { todoList } = this;
		let isLength = 0;

		for (const i in todoList) {
			todoList[i].completed === status && isLength++;
		}
		return status === 'All' ? Object.keys(todoList).length : isLength;
	}

	setTodoList(todoList) {
		this.todoList = todoList;
	}

	addTodo({ id, content, completed }) {
		this.todoList[id] = { content, completed };
	}

	removeTodo(id) {
		if (this.todoList.length === 1) {
			this.todoList.length = 0;
		} else {
			this.todoList.splice(id, 1);
		}
	}

	updateTodo(id, newContent) {
		this.todoList[id].content = newContent;
	}

	toggleState(id, status = undefined) {
		this.todoList[id].completed =
			status === undefined ? !this.todoList[id].completed : status;
	}
}
