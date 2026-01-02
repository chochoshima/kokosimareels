/* ==========================
   VISITOR COUNTER (UNIVERSAL)
========================== */

(function () {
  // Tentukan page key otomatis
  const path = location.pathname.replace("/", "").replace(".html", "") || "index";
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  // Prompt detail → prompt-xxx
  const pageKey = id ? `${path}-${id}` : path;

  fetch(`https://visitor-counter.kokopujiyanto.workers.dev/?page=${pageKey}`, {
    headers: { "Accept": "application/json" },
    credentials: "include"
  })
    .then(r => r.json())
    .then(d => {
      if (!d) return;

      const todayEl = document.getElementById("visitorToday");
      const totalEl = document.getElementById("visitorTotal");

      if (todayEl && typeof d.today === "number") {
        todayEl.textContent = d.today.toLocaleString("id-ID");
      }

      if (totalEl && typeof d.total === "number") {
        totalEl.textContent = d.total.toLocaleString("id-ID");
      }
    })
    .catch(console.warn);
})();
