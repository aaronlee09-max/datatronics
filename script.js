(async function loadFontoryScript() {
  const urls = [
    "https://cdn.jsdelivr.net/gh/aaronlee09-max/datatronics@65d229df901c36a02a18bb1356de19357707f091/script.js",
    "./script.fixed.js?v=20260930-fixed1"
  ];
  let lastError = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const code = await res.text();
      if (code.length < 1000 || code.indexOf("CATEGORY_ICONS") === -1) throw new Error("not a full script");
      const tag = document.createElement("script");
      tag.textContent = code;
      document.body.appendChild(tag);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  console.error(lastError || "script.js load failed");
})();
