!function() {
  const $ = sel => document.querySelector(sel);

  $.el = html => {
    const parent = document.createElement('div');
    parent.innerHTML = html;
    return parent;
  };

  $.append = curry((parent, child) => parent.appendChild(child));
  window.$ = $;
} ();