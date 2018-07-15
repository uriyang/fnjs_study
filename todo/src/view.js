export default class View {
	constructor(element) {
		this.$ = element;
	}

	init(todo) {
		for (const id in todo) {
			const $LI = document.createElement('li');
			const $CHECK_BOX = document.createElement('input');
			const $LABEL = document.createElement('label');
			const $CLOSE_BTN = document.createElement('button');

			// TODO: data-id로 바꾸기
			$LI.setAttribute('id', id);
			$CHECK_BOX.setAttribute('type', 'checkbox');

			$CHECK_BOX.classList.add('toggle');
			$CLOSE_BTN.classList.add('destroy');
			$LABEL.textContent = todo[id].content;

			if (todo[id].completed) {
				$LI.classList.add('completed');
				this.toggleChecked($CHECK_BOX, true);
			}

			$LI.appendChild($CHECK_BOX);
			$LI.appendChild($LABEL);
			$LI.appendChild($CLOSE_BTN);

			this.$.TODO_LIST.appendChild($LI);
		}

		// TODO: 템플릿 리터럴로 교체
		// const $TMPL = todo.map(item => {
		//   return `<li id="${item.id}" class="${item.completed && 'completed'}">
		//       <input class="toggle" type="checkbox" ${item.completed && 'checked'}>
		//       <label>${item.content}</label>
		//       <button class="destroy"></button>
		//     </li>`;
		// });
		// this.$.TODO_LIST.innerHTML = $TMPL.join('');
	}

	toggleFooter(status) {
		this.toogleDisplay(this.$.FOOTER, status);
	}

	addTodo({ id, content }) {
		const $LI = document.createElement('li');
		$LI.setAttribute('id', id);

		$LI.innerHTML = `<input class="toggle" type="checkbox">
		      <label>${content}</label>
		      <button class="destroy"></button>
        </li>`;

		this.$.TODO_LIST.appendChild($LI);
	}

	removeTodo(node) {
		this.$.TODO_LIST.removeChild(node);
	}

	showEditMode({ target: $LABEL }) {
		const { parentNode: $LI } = $LABEL;
		const $NEW_INPUT = document.createElement('input');

		$NEW_INPUT.setAttribute('class', 'edit');
		$NEW_INPUT.value = $LABEL.textContent;

		this.toogleDisplay($LABEL, 'none');
		$LI.classList.value = 'editing';
		$LI.appendChild($NEW_INPUT);
		$NEW_INPUT.focus();
	}

	hideEditMode(target, $LABEL) {
		const $NEW_INPUT = target;
		const $LI = target.parentNode;

		$LI.removeAttribute('class');
		$LI.removeChild($NEW_INPUT);
		this.toogleDisplay($LABEL, 'block');
	}

	toogleDisplay($target, condition) {
		$target.style.display = condition;
	}

	updateTodoCount(count) {
		const $ITEM = `item${count > 1 ? 's' : ''}`;

		this.$.TODO_COUNT.textContent = `${count} ${$ITEM} left`;
	}

	toggleState($TARGET) {
		$TARGET.classList.toggle('completed');
	}

	toggleClsCompleted(status) {
		this.toogleDisplay(this.$.CLS_COMPLETED, status);
	}

	addSelectedFilter($TARGET) {
		$TARGET.classList.add('selected');
	}

	removeSelectedFilter($TARGET) {
		$TARGET.removeAttribute('class');
	}

	toggleChecked($TARGET, status) {
		$TARGET.checked = status;
	}

	toggleToggleAllBtn(status) {
		this.toggleChecked(this.$.TOGGLE_ALL, status);
	}
}
