/* global load */

// Loads all of the parts that I don't want to include in every file. Internet Explorer will choke on this so we
// display a message for them to use an actual modern browser.
try {
  load('include/header.html', 'body > header');
  load('include/nav.html', '#content > nav', 1);
  load('include/footer.html', 'body > footer');
} catch (e) {
  // IE 11 doesn't even support template strings, what?
  // IE 10 and earlier don't support const or let
  // IE 9 and earlier don't support flexbox or gradients but will be able to see this message because of the fallback
  //    background color
  // IE 8 doesn't support the header tag and ignores it, so this message doesn't display at all, and I'm not putting in
  //    a shim just to show things to IE 8 users
  var html = '<div class="ie-message"><p>Your browser does not support modern browser features and will not have ' +
    'access to the full functionality of this site. Please view this site in the latest version of Chrome, Firefox, ' +
    'Opera, Safari, or Edge.</p></div>';
  document.querySelector('header').innerHTML = html;
}
