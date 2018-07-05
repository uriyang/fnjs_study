import * as $ from 'jquery';
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { filter, map } from "rxjs/operators";
import { pipe } from "rxjs/internal-compatibility";

const todoTemplete = (todo: string): JQuery.htmlString => (
    `<li>
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>${todo}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="Create a TodoMVC template">
      </li>`
);

$('.todoapp').each((_, todoapp) => {

    const $main = $(todoapp).find('section.main');
    const $newTodo = $(todoapp).find('input.new-todo');
    const $todoList = $main.find('ul.todo-list');
    const $toggleAll = $main.find('#toggle-all');

    $newTodo.each((_, newTodo) => {
        const appendTodo = (elem: JQuery.htmlString): JQuery => $todoList.append(elem);
        const clearInput = (): void => {(newTodo as HTMLInputElement).value = ""};
        const addTodo = pipe(
            (e: Event) => (e.target as HTMLInputElement),
            (elem: HTMLInputElement): JQuery.htmlString => elem.value,
            todoTemplete,
            appendTodo,
            clearInput
        );
        const enterKeyPressedStream = fromEvent(newTodo, 'keyup')
            .pipe(
                map(e => (e as KeyboardEvent)),
                filter(e => e.code === "Enter"),
            );

        enterKeyPressedStream.subscribe(addTodo)
    });

    $toggleAll.each((_, toggleAll) => {
        fromEvent(toggleAll, 'click').pipe(
            map(e => (e.target as HTMLInputElement)),
        )
    });

});

