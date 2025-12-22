export async function onRequest() {
  const BASE_URL = 'https://kokosimareels.pages.dev/';
  const DATA_FILE = 'functions/data.js';
  const GITHUB_API = `https://api.github.com/repos/chochoshima/kokosimareels/commits/main?path=${DATA_FILE}`;
  const RAW_DATA_API = `https://raw.githubusercontent.com/chochoshima/kokosimareels/main/${DATA_FILE}`;

  let lastmod = new Date().toISOString();
  let pages = ['']; // homepage

  try {
    // Ambil commit terakhir data.js
    const resCommit = await fetch(GITHUB_API, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (resCommit.ok) {
      const dataCommit = await resCommit.json();
      lastmod = dataCommit.commit?.committer?.date || lastmod;
    }

    // Ambil isi data.js untuk daftar prompt
    const resData = await fetch(RAW_DATA_API);
    if (resData.ok) {
      const text = await resData.text();

      // Asumsi data.js export array prompts: ['ai-001', 'ai-002', ...]
      const matches = text.match(/['"]ai-\d+['"]/g);
      if (matches) {
        const ids = matches.map(m => m.replace(/['"]/g, ''));
        ids.forEach(id => pages.push(`prompt.html?id=${id}`));
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
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
