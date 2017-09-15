/* global hljs */

function byId(id) {
  return document.getElementById(id);
}

function query(selector) {
  return document.querySelector(selector);
}

function queryAll(selector) {
  return document.querySelectorAll(selector);
}

function click(element, handler) {
  element.addEventListener('click', handler);
}

function initEventHandlers() {
  // Handles opening and closing of responsive menu
  for (const element of queryAll('header nav ul li#menu, header nav ul li#icon')) {
    click(element, () => {
      for (const item of queryAll('header nav ul li:not(#menu):not(#icon)')) {
        item.classList.toggle('responsive');
      }
      // byId('menu').classList.toggle('responsive');
    });
  }

  // Any changes to the hash (i.e., navigation)
  window.addEventListener('hashchange', loadPage, false);
}

async function getHtml(url) {
  const options = {
    method: 'get',
    headers: new Headers({
      'content-type': 'text/html'
    })
  };
  const response = await fetch(url, options);
  return response.text();
}

async function loadPage() {
  if (!window.location.hash) {
    window.location.hash = 'main';
    select('main');
  }
  const file = window.location.hash.substring(1);   // remove the leading #

  const id = file.split('/')[0];
  select(id);
  for (const element of queryAll('.responsive')) {
    element.classList.remove('responsive');
  }

  const element = query('section.content > article');
  const html = await getHtml(`${file}.html`);

  element.scrollTop = 0;
  element.scrollLeft = 0;
  element.innerHTML = html;

  highlightCode();
}

function select(id) {
  for (const element of queryAll('header nav ul li a')) {
    element.classList.remove('selected');
  }
  query(`li#${id} a`).classList.add('selected');
}

function highlightCode() {
  for (const element of queryAll('pre > code')) {
    const html = element.innerHTML;
    const lines = html.split('\n').slice(1, -1);
    const pattern = lines[0].match(/^\s*/)[0];
    element.innerHTML = lines.map(line => line.replace(pattern, '')).join('\n');

    hljs.highlightBlock(element);
    hljs.lineNumbersBlock(element);
  }
}
