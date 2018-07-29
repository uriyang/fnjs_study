!function() {
  const $ = sel => document.querySelector(sel);

  $.el = html => {
    const parent = document.createElement('div');
    parent.innerHTML = html;
    console.log(parent)
    return parent.children;
  };

  $.append = (parent, child) => parent.appendChild(child);
  window.$ = $;
} ();