export default {
  async fetch(request) {
    try {
      // 1. Fetch file data.js dari GitHub
      const res = await fetch("https://raw.githubusercontent.com/chochoshima/kokosimareels/main/data.js");
      const jsText = await res.text();

      // 2. Eksekusi JS untuk mengambil PROMPT_DATABASE
      const PROMPT_DATABASE = new Function(jsText + "; return PROMPT_DATABASE")();

      // 3. Generate sitemap XML
      const baseUrl = "https://kokosima.com"; // ganti sesuai domain
      const urls = Object.values(PROMPT_DATABASE).map(item => `
    <url>
      <loc>${baseUrl}/video/${item.title.replace(/\s+/g, '-').toLowerCase()}</loc>
      <video:video>
        <video:content_loc>${item.videoUrl}</video:content_loc>
        <video:title>${item.title}</video:title>
        <video:description>${item.text.substring(0, 200)}</video:description>
      </video:video>
    </url>`).join("\n");

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;

      // 4. Return XML response
      return new Response(sitemap, {
        headers: {
          "Content-Type": "application/xml",
        },
      });

    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  }
};
