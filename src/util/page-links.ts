export function pageLinks(html: string, baseUrl: string) {
  const doc = document.implementation.createHTMLDocument(`Cra11y ${baseUrl}`);
  const base = document.createElement('base');
  base.setAttribute('href', baseUrl);
  doc.documentElement.innerHTML = html;
  doc.getElementsByTagName('head')[0].appendChild(base);

  const links = Array.from(doc.querySelectorAll('a')).filter((link) => {
    return typeof link.href === 'string'
      && (link.href.startsWith(baseUrl)
        || (link.href.startsWith('/') && !link.href.startsWith('#')));
  }).map((link: any) => {
    if (link.href.startsWith(baseUrl)) {
      return link.href.replace(/\/$/, '');
    }
    return `${baseUrl}/${link.href.replace(/\/$/, '')}`;
  });

  return [ ...new Set(links) ];
}
