!function() {
  const baseSel = method => (sel, parent = document) => parent[method](sel);
  const $ = baseSel('querySelector');
  // $.find = (sel, parent) => $(sel, parent);
  $.find = curry($);
  $.all = baseSel('querySelectorAll');
  $.findAll = curry($.all)

  $.el = html => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper;
  };

  // $.append = function (parent, child) {
  //   return arguments.length == 1 ? child => $append(parent, child) :
  //   parent.appendChild(child);
  // }  -> curry함수 이용
  // 자동 형변환은 다른 타입이 들어올 경우가 문제가 되는데..
  // == 값 비교, === 값 & 타입 비교
  // length의 리턴 타입은 부호 없는 32비트 정수형
  // 오히려 암묵적 형변환은 잘 쓰면 좋다.
  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/length
  $.append = curry((parent, child) => parent.appendChild(child));

  $.on = (delegateTarget, eventName, f = sel, sel) => {
    delegateTarget.addEventListener(eventName, f);
  };

  window.$ = $;
} ();