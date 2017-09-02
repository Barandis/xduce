/* global load */
try {
  load('include/header.html', 'body > header');
  load('include/nav.html', '#content > nav', 1);
  load('include/footer.html', 'body > footer');
} catch (e) {
  document.querySelector('.ie-message').style.display = 'table-cell';
}
