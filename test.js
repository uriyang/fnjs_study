const _ = require('partial-js');

/**
 * 유틸
 */

const curry = fn =>
    function f(...a) {
        return fn.length > a.length ? (...b) => f(...a, ...b) : fn(...a);
    };

const curryr = fn =>
    function f(...a) {
        return fn.length > a.length ? (...b) => f(...b, ...a) : fn(...a);
    };

function timeLogger(name, fn, ...args) {
    console.time(name);
    const r = fn(...args);
    if (r instanceof Promise) r.then(e => console.timeEnd(name));
    else console.timeEnd(name);
}

const FP = {};
FP.add = curry((a, b) => a + b);
FP.mul = curry((a, b) => a * b);
FP.sub = curryr((a, b) => a - b);
FP.div = curryr((a, b) => a / b);

FP.isArray = xs => xs instanceof Array;
FP.map = curryr((xs, fn) => {
    if (!FP.isArray(xs)) return [];

    const arr = [];

    for (const x of xs) {
        arr.push(fn(x, xs.indexOf(x)));
    }
    return arr;
});

FP.pipe = (...fns) => arg =>
    fns.reduce(
        (acc, fn) => (acc instanceof Promise ? acc.then(r => fn(r)) : fn(acc)),
        arg
    );

// 기본 맵
{
    const map = (xs, fn) => {
        const arr = [];

        for (const x of xs) {
            arr.push(fn(x, xs.indexOf(x)));
        }
        return arr;
    };

    // 생각해볼점 - for of 는 나쁜 것인가?
    // eslint airbnb 의 에러 메세지
    /**
     * iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them.
     * Separately, loops should be avoided in favor of array iterations. (no-restricted-syntax)
     */

    // (https://github.com/airbnb/javascript/issues/1122)

    // console.log(map([1, 2, 3, 4, 5], a => a * 2));
}

// 비동기 가능 맵
{
    const concat = (xs, x) => {
        const nx = typeof x === 'function' ? x() : x;
        return nx instanceof Promise ? nx.then(r => [...xs, r]) : [...xs, nx];
    };

    // 순차적인 비동기 가능한 map
    // 비동기가 아닐 경우 일반 배열 리턴
    const map = (xs, fn) => {
        let acc = [];
        for (const x of xs) {
            acc =
                acc instanceof Promise
                    ? acc.then(nacc => concat(nacc, fn(x)))
                    : concat(acc, fn(x));
        }
        return acc;
    };

    const mapS = (xs, fn) => {
        return xs.reduce((acc, cur) => {
            return acc instanceof Promise
                ? acc.then(arr => concat(arr, fn(cur)))
                : concat(acc, fn(cur));
        }, []);
    };

    // 비동기 동시성을 가진 map
    // 클로져 형태로 프로미스를 계속 내려보낸 다음, 앞에 프로미스가 끝나면 바로 concat 하고 다음 concat 하고 하는 식, fn 을 실행하는 순간 비동기 처리가 시작되므로 concurrent 한 효과
    const mapC_1 = (xs, fn) => {
        return xs.reduce((acc, cur) => {
            const x = fn(cur);
            return acc instanceof Promise
                ? acc.then(arr => concat(arr, x))
                : concat(acc, x);
        }, []);
    };

    // 프로미스 플래그를 두고, 배열을 접어나가면서 프로미스를 새로운 배열에 그대로 추가. 프로미스가 중간에 하나라도 나올 경우 마지막에 Promise.all 로 감싸주고 아니면 그냥 리턴
    const mapC_2 = (xs, fn) => {
        let isPromise = false;
        const nxs = xs.reduce((acc, cur) => {
            const x = fn(cur);
            if (x instanceof Promise) isPromise = true;
            acc.push(x);
            return acc;
            // return [...acc, x];
        }, []);
        return isPromise ? Promise.all(nxs) : nxs;
    };

    const arr = [1, 2, 3, 4, 5];
    const arr1000 = _.range(1000);
    const asyncFn = async a => a * 10;

    const delay = (t) => {
        return new Promise((res, rej) => {
            setTimeout(res, t);
        });
    };

    const longTakeFn = async (a) => {
        await delay(10);
        return a * 10;
    };

    // only one of two
    // testMapTime(arr, longTakeFn);
    testMapTime(arr1000, longTakeFn);

    function testMapTime(arr, fn) {
        timeLogger('map', () => map(arr, longTakeFn));
        timeLogger('mapS', () => mapS(arr, longTakeFn));
        timeLogger('mapC_1', () => mapC_1(arr, longTakeFn));
        timeLogger('mapC_2', () => mapC_2(arr, longTakeFn));
    }
}

/**
 * 다형성
 */

// 1. 외부 다형성

// 강의의 예제에서는 array like가 예제로 나왔는데, 사실 es6이 나온 현재의 자바스크립트에서는 딱히 해당 예제가 실용적이지는 않다
// 여러 타입을 받고자 하는 기존 oop 의 다형성은 여러 타입이 들어올 수 있다는 점이 특징이지만,
// 함수형 프로그래밍은 기본적으로 pure js 데이터 타입들을 활용한다는 점에서 다형성이 크게 효과를 얻는 부분이 무엇일까?
// Array 와 Object 를 구분하지 않고 쓸 수 있는, 혹은 써야 하는 함수들이 생길까? 그렇게 써야 한다고 하더라도 하나로 받는게 좋을까? 아니면 따로 만드는게 좋을까?

// map 을 객체와 배열 둘다 쓸 수 있도록 한다고 해보자
// iterator 가 들어오면 해당 반복기를 돌리고, 그게 아니라면 object 를 순회한다
// 객체를 전달한다면, 기존의 (element, index) 형태 말고 (value, key) 형태로 루프를 돈다고 가정하자
{
    const arr = [1, 2, 3, 4, 5];
    const obj = { a: 10, b: 20, c: 30 };

    const map = (xs, fn) => {
        const isIterable = typeof xs[Symbol.iterator] === 'function';

        // 이터러블도 아니고 객체도 아니면 리턴
        if (!isIterable || typeof xs !== 'object') return xs;
        const sliced = isIterable ? [...xs] : Object.entries(xs);
        const nxs = [];
        for (const entry of sliced) {
            const [key, val] = isIterable
                ? [sliced.indexOf(entry), entry]
                : entry;
            nxs.push(fn(val, key));
        }
        return nxs;
    };
}

// 고차 함수로 만들어두고, 다른 인자가 어떤 데이터로 들어오는지에 따라서 보조함수를 다르게 줌으로써 함수를 다형성 높게 활용할 수 있다

/**
 * 에러 처리
 */

{
    // 에러 처리는 어떻게 하는 것이 좋을까?
    // 인동님이 강의에서 null 같은게 함수에 들어와도 안전하게 실행될 수 있게 한다고 하셨는데
    // 그렇다면 에러가 안나고 그냥 정상적으로 실행되는 것처럼 보이는게 옳은가?
    // null 이 들어오면 안되는데 들어왔다면 버그일텐데 이게 정상적으로 실행이 된다면 (빈 배열이나 빈 객체 리턴이지만) 디버깅은 어떻게 하는가?
    // 서버라고 가정을 하고, 나중에 빈배열로 오면 안되는 곳에서 빈배열이 와서 에러 리스폰스를 날렸다면, 개발자는 나중에 디버깅을 할 때 언제 null 이 생겼고, 그때부터 빈배열로 내려왔는지 찾기 어렵다

    // 비동기 파이프라인
    const pipe = (...fns) => arg =>
        fns.reduce(
            (acc, fn) =>
                acc instanceof Promise ? acc.then(r => fn(r)) : fn(acc),
            arg
        );

    const add1All = FP.map(FP.add(1));
    const mul2All = FP.map(FP.mul(2));
    const div2All = () => null;

    pipe(
        add1All,
        mul2All,
        div2All,
        add1All,
        mul2All,
        add1All,
        _.catch(err => console.log(err))
        // console.log
    )([1, 2, 3]);

    // 어디에서 null 이 반환이 되었고, 어디서부터 빈 어레이가 되었는지 추적하기 어려움
}

/**
 * pipe 활용과 응용
 */

{
    // 로직을 어디까지 pipe 로 묶을 것인가?
    // pipe();
}