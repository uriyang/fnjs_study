!function() {
    const baseSel = method => (sel, parent = document) => parent[method](sel);
    const $ = baseSel('querySelector');
    $.all = baseSel('querySelectorAll');

    $.find = _curry2($);
    $.findAll = _curry2($.all);

    $.el = html => {
        var parent = document.createElement('div');
        parent.innerHTML = html;
        return parent.children[0];
    };

    $.createElement = tag => document.createElement(tag);

    const _attr = function (tag, attrObj) {
        _each(attrObj, function (v, key) {
            tag[key] = v;
        });
        return tag;
    };
    $.attr = _curryr2(_attr);

    const appendChild = function (p, cn) {
        if (arguments.length == 1) {
            c => appendChild(p, c);
        } else if (arguments.length == 2) {
            if (_isArray(cn)) {
                _each(cn, function (child) {
                    p.appendChild(child);
                });
            } else {
                p.appendChild(cn);
            }
        }
        return p;
    };

    $.append = _curry2(appendChild);

    $.addOnClick = (e, f) => e.onClick = f;
    $.addOnChange = (e, f) => e.onChange = f;
    window.$ = $;
}();