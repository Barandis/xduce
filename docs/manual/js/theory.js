/* global load */

try {
  load('../include/header.html', 'body > header');
  load('include/nav.html', '#content > nav', 2);
  load('../include/footer.html', 'body > footer');
  load('include/aside.html', '#content > aside', 3);
} catch (e) {
  document.querySelector('.ie-message').style.display = 'table-cell';
}
