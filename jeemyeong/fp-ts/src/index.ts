import { fromNullable, None, Option, Some } from 'fp-ts/lib/Option';
import { curry, pipe } from "fp-ts/lib/function";

const c = curry;
const $ = (selector: string, element: Element | Document = document) => element.querySelectorAll(selector);
const addEventListener = (type: string, fn: any) => (element: EventTarget) => element.addEventListener(type, fn) || element;
const isEnter = (e: KeyboardEvent) => e.keyCode == 13;
const verifyKeyboardEvent = (e: KeyboardEvent) =>
    isEnter(e) && (e.target as HTMLInputElement).value.length > 0;
const eventToOption = (pred: (e: KeyboardEvent) => boolean) => (e: KeyboardEvent) => {
  return (pred(e) ? new Some(e) : None.value);
};
const keyboardEventToValue = (e: KeyboardEvent) => (e.target as HTMLInputElement).value;
const createElem = (tagName: string, template: string) => {
  const elem = document.createElement(tagName);
  elem.innerHTML = template;
  return elem
};
const tap = <T, U>(fn: (x: U) => T) => (x: U): U => {
  fn(x);
  return x;
};
// side effect
const appendLi = (elem: Element, ul: Element) => {
  ul.appendChild(elem);
  return elem;
};
const getTarget = (e: Event) => (e.target as Element);
const isEventTarget = (e: Event, tagName: string, className?: string) =>
  getTarget(e).tagName.toLowerCase() == tagName.toLowerCase() && (!className || getTarget(e).classList.contains(className));

// side effect
const toggleClassIntoElem = (className: string) => (elem: Element) => {
  elem.classList.contains(className) ? elem.classList.remove(className) : elem.classList.add(className);
  return elem
};
const getFirstNullable = <T>(list: T) => fromNullable(list[0]);

const getInnerHtml = (elem: Element) =>
  elem.innerHTML;

(function () {
  (function(todoApp: Option<Element>) {
    const todoTemplate = (todo: string) => (`
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>${todo}</label>
          <button class="destroy"></button>
        </div>
      `);

    const todoCountTemplate = (count: number) =>
      `<strong>${count}</strong> item left</span>`;

    (function(todoList: Option<Element>){

      (function addTodo(todoList: Option<Element>) {
        // side effect
        const clearInput = () =>
          todoApp
            .map(c($)('input.new-todo'))
            .chain(getFirstNullable)
            .map(input => input["value"] = '');

        // side effect
        const appendTodoElem = (todoElem: Element) =>
          todoList
            .map( c(appendLi)(todoElem) )
            .map( tap(clearInput) );

        const createTodoElem = (todo: string) => createElem("li", todoTemplate(todo));

        const addTodo = (e: KeyboardEvent) =>
          fromNullable(e)
            .chain(eventToOption(verifyKeyboardEvent))
            .map(keyboardEventToValue)
            .map(createTodoElem)
            .map(tap(appendTodoElem))
            .map(tap(() => updateTodoCount(getTodoCountNullable())));

        todoApp
          .map(addEventListener('keydown', addTodo));

      })(todoApp.chain(elem => getFirstNullable($('ul.todo-list', elem))));


      (function deleteTodo(todoList: Option<Element>){
        const filterEventTarget = (e: Event) =>
          fromNullable(e)
            .filter(e => (isEventTarget(e, "button", "destroy")))
            .map(tap(console.log))
            .map(getTarget);

        const deleteTodo = (target: Option<Element>) =>
          target
            .map(target => target.closest("li"))
            .filter(elem => confirm(`Delete?`))
            // side effect
            .map(elem => elem.remove())
            .map(tap(() => updateTodoCount(getTodoCountNullable())));

        todoList
          .map(addEventListener('click', pipe(filterEventTarget, deleteTodo)));

      })(todoApp.chain(elem => getFirstNullable($('ul.todo-list', elem))));

      const getAllTodoList = () =>
        todoList
          .map(c($)('li'))
          .map(lst => Array.from<Element>(lst));

      const getCompletedList = (list: Array<Element>) =>
        list.filter(li => (li["classList"] as DOMTokenList).contains("completed"));

      const getUncompletedList = (list: Array<Element>) =>
        list.filter(li => !(li["classList"] as DOMTokenList).contains("completed"));

      const filterEventTarget = (e: Event) =>
        fromNullable(e)
          .filter(e => (isEventTarget(e, "input", "toggle")))
          .map(getTarget);

      const checkTodo = (target: Option<Element>) =>
        target
          .map(target => target.closest("li"))
          // side effect
          .map(toggleClassIntoElem("completed"))
          .map(tap(() => updateTodoCount(getTodoCountNullable())));

      todoList
        .map(addEventListener('click', pipe(filterEventTarget, checkTodo)));

      (function checkAllTodo(label: Option<Element>) {

        const toggleCheckbox = (li: Element) =>
          getFirstNullable($("input.toggle", li))
            .map(input => (input as HTMLInputElement).checked = !(input as HTMLInputElement).checked);

        const checkAllTodo = () =>
          getAllTodoList()
            .map(list => {
              const completedList = getCompletedList(list);
              if (completedList.length < list.length) {
                return getUncompletedList(list);
              }
              return completedList;
            })
            .map(tap(list =>
              list.forEach((li: Element) =>
                checkTodo(fromNullable(li))
                  .map(toggleCheckbox))));

        label
          .map(addEventListener('click', checkAllTodo));
      })(todoApp.chain(elem => getFirstNullable($('label[for=toggle-all]', elem))));

      (function filter(filters: Option<Element>) {

        enum Filter {
          All = "All",
          Active = "Active",
          Completed = "Completed"
        };

        const hiddenElem = (elem: HTMLElement) => elem.style.display = "none";
        const showElem = (elem: HTMLElement) => elem.style.display = "";

        const filterTodo = (filter: Filter) => {
          switch (filter) {
            case Filter.All:
              getAllTodoList()
                .map(li => {
                  // side effect
                  li.forEach(showElem)
                });
              break;
            case Filter.Completed:
              getAllTodoList()
                .map(list => {
                  // side effect
                  getCompletedList(list).forEach(showElem);
                  getUncompletedList(list).forEach(hiddenElem);
                });
              break;
            case Filter.Active:
              getAllTodoList()
                .map(list => {
                  // side effect
                  getCompletedList(list).forEach(hiddenElem);
                  getUncompletedList(list).forEach(showElem);
                });
              break;
          }
        };

        const filterEvent = (e: Event) =>
          fromNullable(e)
            .filter(e => (isEventTarget(e, "a")))
            .map(getTarget)
            .map(tap(
              target =>
                filters
                  .map(filters => $('a', filters))
                  .map(filter => Array.from<Element>(filter))
                  .map(anchors =>
                    anchors
                      .filter(anchor => anchor != target)
                      .forEach(anchor => anchor.classList.remove("selected")))
            ))
            .map(tap(toggleClassIntoElem("selected")))
            .map(getInnerHtml)
            .chain(filter => filter in Filter ? new Some(filter) : None.value)
            .map(tap(filterTodo));

        filters
          .map(addEventListener('click', filterEvent))
      }(todoApp.chain(elem => getFirstNullable($('ul.filters', elem)))));

      (function clearComplete(clearCompleteBtn: Option<Element>) {
        const clearComplete = () =>
          getAllTodoList()
            .map(list => {
              getCompletedList(list).forEach(
                li => (li as Element).remove()
              );
            });

        clearCompleteBtn
          .map(addEventListener('click', clearComplete))
      }(todoApp.chain(elem => getFirstNullable($('button.clear-completed', elem)))));

      const updateTodoCount = (todoCount: Option<Element>) =>
        getAllTodoList()
          .map(getUncompletedList)
          .map(lst => lst.length)
          .map(count =>
            todoCount.map(todoCount => todoCount.innerHTML = todoCountTemplate(count))
          );
      const getTodoCountNullable = () => (todoApp.chain(elem => getFirstNullable($('.todo-count', elem))));
      updateTodoCount(getTodoCountNullable());

    })(todoApp.chain(elem => getFirstNullable($('ul.todo-list', elem))));

  })(getFirstNullable($('.todoapp')))
})();