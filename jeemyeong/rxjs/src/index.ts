import * as $ from 'jquery';
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { filter, map } from "rxjs/operators";
import { pluck } from "rxjs/internal/operators";
import * as R from 'ramda';
import { merge } from "rxjs/index";

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
    const $todoapp = $(todoapp);
    const $main = $todoapp.find('section.main');
    const $newTodo = $todoapp.find('input.new-todo');
    const $todoList = $main.find('ul.todo-list');
    const $toggleAll = $main.find('#toggle-all');
    const $footer = $todoapp.find('footer.footer');
    const $todoCount = $todoapp.find('.todo-count strong');
    const $filters = $todoapp.find('.filters');
    const $clearCompletedBtn = $todoapp.find('button.clear-completed');

    const appendTodo = (elem: JQuery.htmlString): JQuery => $todoList.append(elem);
    const clearInput = () => $newTodo.each((_, newTodo) => {
        (newTodo as HTMLInputElement).value = ""
    });
    const addTodo = R.pipe(
        (e: KeyboardEvent) => (e.target as HTMLInputElement),
        (elem: HTMLInputElement): JQuery.htmlString => elem.value,
        todoTemplete,
        appendTodo
    );
    const addTodo$ = fromEvent($newTodo, 'keyup')
        .pipe(
            pluck('originalEvent'),
            map(e => (e as KeyboardEvent)),
            filter(e => e.code === "Enter"),
            filter(e => (e.target as HTMLInputElement).value.trim().length > 0)
        );

    addTodo$.subscribe(addTodo);

    $toggleAll.each((_, toggleAll) => {
        fromEvent(toggleAll, 'click').pipe(
            map(e => (e.target as HTMLInputElement))
        )
    });

    const clickToggleAll$ = fromEvent($toggleAll, 'click').pipe(
        map(e => (e.target as HTMLInputElement)),
        map(elem => elem.checked)
    );
    const getCurrentFilterElem = () => $filters.find('a.selected')[0];
    const getFilterFromElem = (elem: HTMLElement) => elem.innerText.trim().toLowerCase();

    const $filteredTodosByChecked = (checked: boolean) => $todoList.find('li').filter(
      (_, todoElem) => checked ? $(todoElem).hasClass('completed') : !$(todoElem).hasClass('completed'));
    const toggleCheck = ($elem: JQuery) => $elem.find('input.toggle').each((_, elem) => {
        (elem as HTMLInputElement).checked = !(elem as HTMLInputElement).checked;
    });
    const toggleComplete = ($elem: JQuery) => ($elem as JQuery).toggleClass('completed');
    const getTodoFromToggleBtn = (toggleBtn: HTMLInputElement) => $(toggleBtn).closest('li');
    const toggleTodosByCheck = R.pipe(
        (check) => $filteredTodosByChecked(!check),
        R.tap(toggleCheck),
        R.tap(toggleComplete)
    );

    clickToggleAll$.subscribe(toggleTodosByCheck);

    const toggle$ = fromEvent($todoList, 'click').pipe(
        map(e => (e.target as HTMLInputElement)),
        filter(elem => $(elem).is('.toggle')),
    );

    toggle$.subscribe(
        R.pipe(
            getTodoFromToggleBtn,
            R.tap(toggleComplete)
        )
    );

    const toggleAll$ = toggle$.pipe(
        map(_ =>
            Array
                .from($todoList.find('input.toggle')
                    .map(
                        (_, toggle) => (toggle as HTMLInputElement).checked))
                .every( checked => checked)));

    const checkToggleAllBtn = (checked: boolean) => $toggleAll.each((_, toggleAll) => {
        (toggleAll as HTMLInputElement).checked = checked
    });

    addTodo$.subscribe(() => checkToggleAllBtn(false));

    toggleAll$.subscribe(checkToggleAllBtn);

    merge(clickToggleAll$, toggleAll$).subscribe(
        checked => checked ? $clearCompletedBtn.appendTo($footer) : $clearCompletedBtn.remove()
    );

    const destroyTodo$ = fromEvent($todoList, 'click').pipe(
        map(e => (e.target as HTMLInputElement)),
        filter(elem => $(elem).is('.destroy')),
    );

    destroyTodo$.subscribe(
        R.pipe(
            getTodoFromToggleBtn,
            R.tap($elem => $elem.remove())
        )
    );

    const getTotalCount = () => $todoList.find('input.toggle').filter((_, toggle) => !(toggle as HTMLInputElement).checked).length;

    const updateTodoCount = () => {
        $todoCount.each((_, todoCount) => {
            (todoCount as HTMLElement).innerText = getTotalCount().toString();
        })
    };

    merge(addTodo$, destroyTodo$, clickToggleAll$, toggle$).subscribe(updateTodoCount);

    const hideTodoByCheck = R.pipe(
        (check: boolean) => ([$filteredTodosByChecked(check), $filteredTodosByChecked(!check)]),
        ([$a, $b]: JQuery[]) => {
            $a.each((_, a) => {
                a.style.display = "none";
            });
            $b.each((_, b) => {
                b.style.display = "";
            });
        });

    const showAllTodo = () => $todoList.find('li').each((_, elem) => {
        elem.style.display = "";
    });

    const filter$ = fromEvent($filters, 'click').pipe(
        map(e => (e.target as HTMLElement)),
        map(getFilterFromElem)
    );
    const updateByFilter = (filter: string) => filter === "active" ? hideTodoByCheck(true) : filter === "completed" ? hideTodoByCheck(false) : showAllTodo();

    const selectFilter = (filter: string) => $filters.find('a').each((_, elem) => {
        getFilterFromElem(elem) === filter ? $(elem).addClass("selected") : $(elem).removeClass("selected")
    });

    filter$.subscribe(
        selectFilter
    );

    const clickClearCompleteBtn$ = fromEvent($todoapp, 'click').pipe(
      map(e => (e.target as HTMLInputElement)),
      filter(elem => $(elem).is('button.clear-completed')),
    );

    const clearComplete = () => $filteredTodosByChecked(true).each((_, elem) => {
        elem.remove()
    });

    clickClearCompleteBtn$.subscribe(clearComplete);

    const updateByFilterByCurrentFilter = R.pipe(
        getCurrentFilterElem,
        getFilterFromElem,
        updateByFilter
    );

    merge(clickToggleAll$, addTodo$, filter$).subscribe(
        updateByFilterByCurrentFilter
    );

    // This should be the last at the logic
    addTodo$.subscribe(clearInput);


    (function init() {
        updateTodoCount()
    })();
});

