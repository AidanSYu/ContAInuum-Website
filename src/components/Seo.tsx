/* =============================================================================
   Seo — per-route head tags. React 19 hoists <title>/<meta>/<link> to <head>,
   so dropping <Seo/> at the top of a page sets a consistent title, description,
   canonical URL, and Open Graph / Twitter card for that route.

   Note: this covers JS-executing crawlers (e.g. Google). Social unfurlers and
   bots that don't run JS still see the static index.html tags — for fully
   correct per-route unfurls, add prerendering/SSR (see follow-ups).
   ============================================================================= */

const SITE_URL = 'https://contineon.io';
const DEFAULT_IMAGE = '/images/sr71-quote-wide.png';

function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/pricing". Used for canonical + og:url. */
  path: string;
  image?: string;
  type?: 'website' | 'article';
}) {
  const url = absolute(path);
  const img = absolute(image);
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Contineon" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </>
  );
}
