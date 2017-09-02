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

async function load(url, selector, unlink) {
  const element = document.querySelector(selector);
  const html = await getHtml(url);
  element.innerHTML = html;

  if (unlink) {
    const li = element.querySelector(`ul li:nth-child(${unlink})`);
    const text = li.textContent;
    li.innerHTML = `<strong>${text}</strong>`;
  }
}

for (const element of document.querySelectorAll('pre > code')) {
  const html = element.innerHTML;
  const lines = html.split('\n').slice(1, -1);
  const pattern = lines[0].match(/^\s*/)[0];
  element.innerHTML = lines.map(line => line.replace(pattern, '')).join('\n');

  hljs.highlightBlock(element);
  hljs.lineNumbersBlock(element);
}
