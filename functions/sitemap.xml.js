export async function onRequestGet() {
  const site = "https://kokosimareels.pages.dev";
  const githubRawUrl = "https://raw.githubusercontent.com/chochoshima/kokosimareels/main/data.js";

  // Ambil data.js
  const res = await fetch(githubRawUrl);
  const js = await res.text();

  // Ambil objek PROMPT_DATABASE dari data.js
  const match = js.match(/PROMPT_DATABASE\s*=\s*(\{[\s\S]*?\});/);
  if (!match) {
    return new Response("Invalid data.js", { status: 500 });
  }

  let jsonStr = match[1]
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, '$1');

  let PROMPT_DATABASE;
  try {
    PROMPT_DATABASE = JSON.parse(jsonStr);
  } catch {
    return new Response("Failed to parse database", { status: 500 });
  }

  let urls = `<url><loc>${site}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
  for (const id of Object.keys(PROMPT_DATABASE)) {
    urls += `<url><loc>${site}/prompt.html?id=${id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(sitemap, { headers: { "Content-Type": "application/xml" } });
}
