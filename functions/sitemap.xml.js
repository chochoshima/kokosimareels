export async function onRequest() {
  const BASE_URL = 'https://kokosimareels.pages.dev/';
  const DATA_FILE = 'data.js'; // Pastikan path benar (biasanya di root, bukan functions/)
  const GITHUB_COMMIT_API = `https://api.github.com/repos/chochoshima/kokosimareels/commits/main?path=${DATA_FILE}`;
  const RAW_DATA_API = `https://raw.githubusercontent.com/chochoshima/kokosimareels/main/${DATA_FILE}`;

  let lastmod = new Date().toISOString();
  let pages = ['']; // homepage

  try {
    // 1. Ambil commit terakhir (Wajib User-Agent agar tidak kena 403)
    const resCommit = await fetch(GITHUB_COMMIT_API, {
      headers: { 
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Cloudflare-Pages-Function' 
      }
    });
    
    if (resCommit.ok) {
      const dataCommit = await resCommit.json();
      lastmod = dataCommit.commit?.committer?.date || lastmod;
    }

    // 2. Ambil isi data.js
    const resData = await fetch(RAW_DATA_API);
    if (resData.ok) {
      const text = await resData.text();
      
      // Regex ini mengambil semua key di dalam objek (ID Prompt)
      // Mencari pola "ID": { atau 'ID': {
      const matches = [...text.matchAll(/^\s*['"]?([\w-]+)['"]?\s*:/gm)];
      
      if (matches.length > 0) {
        const ids = matches.map(m => m[1]);
        // Hilangkan duplikat jika ada
        const uniqueIds = [...new Set(ids)];
        uniqueIds.forEach(id => pages.push(`prompt.html?id=${id}`));
      }
    }
  } catch (e) {
    console.log('GitHub API error:', e);
  }

  // Generate sitemap XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  pages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  return new Response(xml, {
    headers: { 
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Cache 1 jam agar hemat limit API GitHub
    }
  });
}
