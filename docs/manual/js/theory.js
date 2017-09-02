/* global load */

try {
  load('../include/header.html', 'body > header');
  load('include/nav.html', '#content > nav', 2);
  load('../include/footer.html', 'body > footer');
  load('include/aside.html', '#content > aside', 2);
} catch (e) {
  /* eslint-disable no-var */
  var html = '<div class="ie-message"><p>Your browser does not support modern browser features and will not have ' +
    'access to the full functionality of this site. Please view this site in the latest version of Chrome, Firefox, ' +
    'Opera, Safari, or Edge.</p></div>';
  document.querySelector('header').innerHTML = html;
  /* eslint-enable no-var */
}
