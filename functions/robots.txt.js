export async function onRequestGet() {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://kokosimareels.pages.dev/sitemap.xml",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain" },
  });
}
