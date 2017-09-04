/* global load */

try {
  load('../include/header.html', 'body > header');
  load('include/main.html', '#content > nav.main', 2);
  load('../include/footer.html', 'body > footer');
  load('include/aux.html', '#content > nav.aux', 1);
} catch (e) {
  document.querySelector('.ie-message').style.display = 'table-cell';
}
