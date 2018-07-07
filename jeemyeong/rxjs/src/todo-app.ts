import * as $ from 'jquery';
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { filter, map } from "rxjs/operators";
import * as R from 'ramda';
import { pluck } from "rxjs/internal/operators";

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

export const todoapp = R.pipe<JQuery, JQuery>(R.tap($todoapp => $todoapp.each(() => {
    const getCurrentFilterElem = () => $todoapp.find('.filters').find('a.selected')[0];
    const getFilterFromElem = (elem: HTMLElement) => elem.innerText.trim().toLowerCase();
    const appendTodo = R.pipe(
        (e: KeyboardEvent) => (e.target as HTMLInputElement),
        (elem) => elem.value,
        todoTemplete,
        $,
        (to: JQuery) => (elem: JQuery) => elem.appendTo(to));
    const $filteredTodosByChecked = (checked: boolean) => $todoapp.find('ul.todo-list').find('li').filter(
        (_, todoElem) => checked ? $(todoElem).hasClass('completed') : !$(todoElem).hasClass('completed'));
    const toggleCheck = ($elem: JQuery) => $elem.find('input.toggle').each((_, elem) => {
        (elem as HTMLInputElement).checked = !(elem as HTMLInputElement).checked;
    });
    const toggleComplete = ($elem: JQuery) => ($elem as JQuery).toggleClass('completed');
    const getTodoFromToggleBtn = (toggleBtn: HTMLInputElement) => $(toggleBtn).closest('li');
    const destroyTodo = R.pipe(
        getTodoFromToggleBtn,
        R.tap($elem => $elem.remove())
    );
    const completeByChecked = R.pipe(
        (checked: boolean) => $filteredTodosByChecked(!checked),
        R.tap(toggleCheck),
        R.tap(toggleComplete)
    );
    const checkToggleAllBtn = (checked: boolean) => $todoapp.find('#toggle-all').each((_, toggleAll) => {
        (toggleAll as HTMLInputElement).checked = checked
    });
    const offToggleAllBtn = () => checkToggleAllBtn(false);
    const getTotalCount = () => $todoapp.find('ul.todo-list').find('input.toggle').filter((_, toggle) => !(toggle as HTMLInputElement).checked).length;
    const updateTodoCount = () => {
        $todoapp.find('.todo-count strong').each((_, todoCount) => {
            (todoCount as HTMLElement).innerText = getTotalCount().toString();
        })
    };
    const completeToggle = R.pipe(
        getTodoFromToggleBtn,
        R.tap(toggleComplete)
    );
    const $clearCompletedBtn = $todoapp.find('button.clear-completed');
    const showClearCompletedBtn = (checked: boolean) => checked ? $clearCompletedBtn.appendTo($todoapp.find('footer.footer')) : $clearCompletedBtn.remove();
    const showAllTodo = () => $todoapp.find('ul.todo-list').find('li').each((_, elem) => {
        elem.style.display = "";
    });
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
    const updateByFilter = (filter: string) => filter === "active" ? hideTodoByCheck(true) : filter === "completed" ? hideTodoByCheck(false) : showAllTodo();
    const selectFilter = (filter: string) => $todoapp.find('.filters').find('a').each((_, elem) => {
        getFilterFromElem(elem) === filter ? $(elem).addClass("selected") : $(elem).removeClass("selected")
    });
    const clearInput = () => $todoapp.find('input.new-todo').each((_, newTodo) => {
        (newTodo as HTMLInputElement).value = ""
    });
    const clearComplete = () => $filteredTodosByChecked(true).each((_, elem) => {
        elem.remove()
    });

    const updateByCurrentFilter = R.pipe(
        getCurrentFilterElem,
        getFilterFromElem,
        updateByFilter
    );

    class Observables {
        static addTodo$ = fromEvent($todoapp.find('input.new-todo'), 'keyup')
            .pipe(
                pluck('originalEvent'),
                map(e => (e as KeyboardEvent)),
                filter(e => e.code === "Enter"),
                filter(e => (e.target as HTMLInputElement).value.trim().length > 0)
            );

        static clickToggleAll$ = fromEvent($todoapp.find('#toggle-all'), 'click').pipe(
            map(e => (e.target as HTMLInputElement)),
            map(elem => (elem.checked as boolean))
        );

        static toggle$ = fromEvent($todoapp.find('ul.todo-list'), 'click').pipe(
            map(e => (e.target as HTMLInputElement)),
            filter(elem => $(elem).is('.toggle')),
        );

        static toggleAll$ = Observables.toggle$.pipe(
            map(_ =>
                Array
                    .from($todoapp.find('ul.todo-list').find('input.toggle')
                        .map(
                            (_, toggle) => (toggle as HTMLInputElement).checked))
                    .every( checked => checked)));

        static destroyTodo$ = fromEvent($todoapp.find('ul.todo-list'), 'click').pipe(
            map(e => (e.target as HTMLInputElement)),
            filter(elem => $(elem).is('.destroy')),
        );

        static filter$ = fromEvent($todoapp.find('.filters'), 'click').pipe(
            map(e => (e.target as HTMLElement)),
            filter(elem => $(elem).is('a')),
            map(getFilterFromElem)
        );
        static clickClearCompleteBtn$ = fromEvent($todoapp, 'click').pipe(
            map(e => (e.target as HTMLInputElement)),
            filter(elem => $(elem).is('button.clear-completed')),
        );
    };

    (function subscribe() {
        Observables.addTodo$.subscribe(R.pipe(
            R.tap(appendTodo),
            R.tap(offToggleAllBtn),
            R.tap(updateTodoCount),
            R.tap(updateByCurrentFilter),
            R.tap(clearInput)
        ));

        Observables.destroyTodo$.subscribe(R.pipe(
            R.tap(destroyTodo),
            R.tap(updateTodoCount)
        ));

        Observables.clickToggleAll$.subscribe(R.pipe(
            R.tap(completeByChecked),
            R.tap(updateTodoCount),
            R.tap(showClearCompletedBtn),
            R.tap(updateByCurrentFilter)
        ));

        Observables.toggle$.subscribe(R.pipe(
            R.tap(completeToggle),
            R.tap(updateTodoCount)
        ));

        Observables.toggleAll$.subscribe(R.pipe(
            R.tap(showClearCompletedBtn),
            R.tap(checkToggleAllBtn),
        ));

        Observables.filter$.subscribe(R.pipe(
            R.tap(selectFilter),
            R.tap(updateByCurrentFilter)
        ));

        Observables.clickClearCompleteBtn$.subscribe(clearComplete);
    })();

    (function init() {
        updateTodoCount()
    })();
})));
