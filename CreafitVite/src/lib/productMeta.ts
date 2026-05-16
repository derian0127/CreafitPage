const DYNAMIC_ATTR = 'data-creafit-meta';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = `meta[${attr}="${key}"][${DYNAMIC_ATTR}]`;
  let el = document.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(DYNAMIC_ATTR, '1');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeDynamicMeta() {
  document.querySelectorAll(`meta[${DYNAMIC_ATTR}]`).forEach((n) => n.remove());
}

/** Meta en cliente para compartir / pestaña; crawlers sin JS siguen viendo index.html. */
export function applyProductMeta(opts: {
  title: string;
  description: string;
  imageUrl?: string;
  path: string;
}) {
  const { title, description, imageUrl, path } = opts;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${origin}${path.startsWith('/') ? path : `/${path}`}`;

  document.title = title;
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description.slice(0, 200));
  upsertMeta('property', 'og:url', url);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'description', description.slice(0, 200));

  if (imageUrl) {
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('name', 'twitter:image', imageUrl);
  } else {
    document.querySelector('meta[property="og:image"][data-creafit-meta]')?.remove();
    document.querySelector('meta[name="twitter:image"][data-creafit-meta]')?.remove();
  }
}

export function clearProductMeta(fallbackTitle: string) {
  document.title = fallbackTitle;
  removeDynamicMeta();
}
