export async function onRequestGet() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://kokosimareels.pages.dev/sitemap.xml`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
