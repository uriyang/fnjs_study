!function() {
    const _isArray = obj => Object.prototype.toString.call(obj) == '[object Array]';
    const _is_object = obj => typeof obj == 'object' && !!obj;
    const _rest = (list, num) => Array.prototype.slice.call(list, num || 1);
    const _keys = obj => _is_object(obj) ? Object.keys(obj) : [];

    const _each = (list, iter) => {
        let keys = _keys(list);
        let len = keys.length;
        for (let i = 0; i < len; ++i) {
            iter(list[keys[i]], keys[i]);
        }
    };

    const _reduce = (list, iter, memo) => {
        if (!memo) {
            memo = list[0];
            list = _rest(list);
        }
        _each(list, (v) => {
            memo = iter(memo, v);
        }, memo);
        return memo;
    };

    // const _curry2 = f => (..._) => _.length < 2 ? (..._2) => f(..._, ..._2) : f(..._);
    // const _curry3 = f => (..._) => _.length < 3 ? _curry2(f)(..._) : f(..._);
    const _curry2 = f => (..._) => _.length < 2 ? (..._2) => f(..._, ..._2) : f(..._);
    const _curryr2 = f => (..._) => _.length < 2 ? (..._2) => f(..._2, ..._) : f(..._);
    const _curry3 = f => (..._) => _.length < 3 ? _curry2(f)(..._) : f(..._);

    /**
    const f1 = _pipe(
        a => a + 1, // 1 + 1 => 2
        b => b * 2, // 2 * 2 => 4
    ); // 4
    console.log(f1(1));
    **/
    const _pipe = (...fns) => {
        return (arg) => {
            return _reduce(fns, (v, fn) => {
                return fn(v);
            }, arg);
        }
    }
    const _go = (..._) => {
        const start = _[0];
        const fns = _rest(_);
        return _pipe.apply(null, fns)(start);
    };

    Object.assign(window, {
        _isArray, _each, _reduce, _curry2, _curryr2, _curry3, _pipe, _go
    });
}();