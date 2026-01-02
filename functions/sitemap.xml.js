export async function onRequest() {
  const BASE_URL = 'https://kokosimareels.pages.dev/';
  const DATA_FILE = 'data.js';
  const GITHUB_COMMIT_API = `https://api.github.com/repos/chochoshima/kokosimareels/commits/main?path=${DATA_FILE}`;
  const RAW_DATA_API = `https://raw.githubusercontent.com/chochoshima/kokosimareels/main/${DATA_FILE}`;

  let lastmod = new Date().toISOString();
  let pages = ['']; 

  try {
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

    const resData = await fetch(RAW_DATA_API);
    if (resData.ok) {
      const text = await resData.text();
      const matches = [...text.matchAll(/^\s*['"]?([\w-]+)['"]?\s*:/gm)];
      
      if (matches.length > 0) {
        const ids = matches.map(m => m[1]);
        const uniqueIds = [...new Set(ids)];
        uniqueIds.forEach(id => pages.push(`prompt.html?id=${id}`));
      }
    }
  } catch (e) {
    console.log('GitHub API error:', e);
  }

  // PERBAIKAN: Pastikan XML dimulai tepat di awal string tanpa spasi
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  pages.forEach(page => {
    // Menghapus tab/spasi ekstra agar XML lebih padat (clean)
    xml += `\n<url><loc>${BASE_URL}${page}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${page === '' ? '1.0' : '0.8'}</priority></url>`;
  });

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: { 
      // PERBAIKAN: Menambahkan charset eksplisit
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
