export async function onRequestGet() {
  const site = "https://kokosimareels.pages.dev";
  const githubRawUrl = "https://raw.githubusercontent.com/chochoshima/kokosimareels/main/data.js";

  try {
    // Ambil data.js
    const res = await fetch(githubRawUrl);
    if (!res.ok) throw new Error("Failed to fetch data.js");
    const js = await res.text();

    // Eksekusi data.js sebagai module kecil untuk ambil PROMPT_DATABASE
    let PROMPT_DATABASE;
    try {
      const moduleFunc = new Function(js + "\nreturn PROMPT_DATABASE;");
      PROMPT_DATABASE = moduleFunc();
    } catch (e) {
      return new Response("Failed to parse PROMPT_DATABASE", { status: 500 });
    }

    // Generate sitemap XML
    const escapeXml = (str) =>
      str.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&apos;");

    let xml = `<url><loc>${escapeXml(site + "/")}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
    for (const id of Object.keys(PROMPT_DATABASE)) {
      xml += `<url><loc>${escapeXml(site + "/prompt.html?id=" + id)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`;
    return new Response(sitemap, { headers: { "Content-Type": "application/xml" } });

  } catch (err) {
    return new Response("Error: " + err.message, { status: 500 });
  }
}
