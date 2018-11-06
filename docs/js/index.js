/*
 * The only concession to IE is using two separate JS files. Since the first one (lib.js) is going to error and
 * stop being processed, the only way to get the error message to appear is to put it in a separate JS file that
 * **will** get processed.
 *
 * This is ES5 because all of the browsers that will want to show the error won't understand ES2015 anyway.
 */
try {
  initEventHandlers();
  loadPage();
} catch (ex) {
  /* eslint-disable no-var */
  // using var because browsers that are going to throw an error here aren't going to understand const
  // Of course, they also won't understand template strings, so lots of concatenation incoming
  var heading = 'Please update your browser';
  var p1 = 'In my work, I have to make sure that the sites I write work with older browsers, especially because many ' +
    'of my clients are government agencies who are often behind the curve when it comes to upgrading technology.';
  var p2 = 'This is not a work project. I do it for fun, and I think it\'s fun to use the latest toys, as long as ' +
    'support for them is sufficient. This site uses a lot of ES2015, which I figure is okay to do in 2017. It also ' +
    'uses newer fun stuff like async functions, the fetch API, and CSS variables. Most modern browsers understand ' +
    'all of these features. Unfortunately, your browser does not understand at least some of them and is objecting ' +
    'to my asking it to use them.';
  var p3 = 'Please use an up-to-date version of Chrome, Firefox, Opera, or Safari to view this site. Microsoft Edge ' +
    'probably also works okay, but use it at your own risk. No version of Internet Explorer will work.';
  var html = '<h1>' + heading + '</h1><p>' + [p1, p2, p3].join('</p><p>') + '</p>';
  /* eslint-enable no-var */
  document.querySelector('section.content > article').innerHTML = html;
  document.querySelector('section.content > aside').style.display = 'none';
}
