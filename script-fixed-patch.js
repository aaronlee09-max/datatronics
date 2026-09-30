(() => {
  function waitForSimulatedDownload() {
    return new Promise((resolve) => {
      const started = performance.now();
      const duration = 206350;
      if (typeof updateDownloadProgress === "function") updateDownloadProgress(0, "다운로드 준비 중…");
      const timer = setInterval(() => {
        const percent = Math.min(100, ((performance.now() - started) / duration) * 100);
        if (typeof updateDownloadProgress === "function") {
          updateDownloadProgress(percent, percent >= 100 ? "파일을 저장하는 중…" : "다운로드 준비 중…");
        }
        if (percent >= 100) {
          clearInterval(timer);
          resolve();
        }
      }, 250);
    });
  }

  function fontFromCard(card) {
    if (!card) return null;
    const file = card.dataset.file || "";
    const list = Array.isArray(window.fonts) ? window.fonts : [];
    const found = list.find((item) => item && (item.file === file || String(item.id) === card.dataset.id));
    if (found) return found;
    if (!file) return null;
    const nameEl = card.querySelector("strong, h3, .font-name");
    const name = (nameEl && nameEl.textContent) || file.split("/").pop() || "font";
    return { name: name.trim(), file };
  }

  async function downloadSingleFontFixed(font, link) {
    if (!font || typeof fetchFontBlob !== "function" || typeof downloadBlob !== "function") {
      throw new Error("다운로드 준비를 아직 끝내지 못했습니다. 잠시 후 다시 눌러 주세요.");
    }
    const oldText = link ? link.textContent : "";
    if (link) {
      link.dataset.busy = "1";
      link.setAttribute("aria-disabled", "true");
      link.style.pointerEvents = "none";
    }
    const bar = document.querySelector("#selectionBar");
    const wasHidden = bar ? bar.hidden : false;
    if (bar) {
      bar.dataset.forceOpen = "1";
      bar.hidden = false;
    }
    if (typeof startDownloadMusic === "function") startDownloadMusic();
    try {
      await waitForSimulatedDownload();
      if (typeof updateDownloadProgress === "function") updateDownloadProgress(100, font.name + " 파일을 저장하는 중…");
      const blob = await fetchFontBlob(font);
      const filename = (font.file || "").split("/").pop() || (font.name + ".ttf");
      await downloadBlob(blob, filename);
      if (typeof updateDownloadProgress === "function") updateDownloadProgress(100, "다운로드가 완료되었습니다.");
      if (typeof hideDownloadProgressSoon === "function") hideDownloadProgressSoon();
    } finally {
      if (link) {
        link.dataset.busy = "0";
        link.removeAttribute("aria-disabled");
        link.style.pointerEvents = "";
        link.textContent = oldText;
      }
      if (bar) {
        delete bar.dataset.forceOpen;
        if (wasHidden) setTimeout(() => { if (!window.selected || !window.selected.size) bar.hidden = true; }, 2000);
      }
    }
  }

  const ready = setInterval(() => {
    if (typeof fetchFontBlob === "function") {
      clearInterval(ready);
      window.waitForSimulatedDownload = waitForSimulatedDownload;
    }
  }, 100);

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a.download");
    if (!link || link.hasAttribute("disabled")) return;
    if (link.dataset.busy === "1") {
      event.preventDefault();
      return;
    }
    const font = fontFromCard(link.closest(".font-card"));
    if (!font) return;
    event.preventDefault();
    downloadSingleFontFixed(font, link).catch((error) => alert(error.message || "다운로드하지 못했습니다."));
  }, true);
})();
