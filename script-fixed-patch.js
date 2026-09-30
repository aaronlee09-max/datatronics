(() => {
  const WIN_LOGO = '<svg class="os-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8.2v8.2H3V3zm9.8 0H21v8.2h-8.2V3zM3 12.8h8.2V21H3v-8.2zm9.8 0H21V21h-8.2v-8.2z"/></svg>';
  const APPLE_LOGO = '<svg class="os-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.7 12.6c0-2.2 1.8-3.3 1.9-3.4-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-.1 2.8-2.2.6-1.1 1-2.1 1-2.1s-2.3-.9-2.3-3.9zm-2.1-6.1c.6-.8 1-1.8.9-2.8-1 .04-2.1.7-2.7 1.5-.6.7-1.1 1.7-.9 2.7 1 .1 2-.6 2.7-1.4z"/></svg>';

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
        if (percent >= 100) { clearInterval(timer); resolve(); }
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
    const nameEl = card.querySelector(".font-name, strong, h3");
    const name = (nameEl && nameEl.textContent) || file.split("/").pop() || "font";
    return { name: name.trim(), file };
  }

  function canMakeIphone(font) {
    if (typeof canInstall === "function") return canInstall(font);
    const ext = String((font.file || "").split(".").pop() || "").toLowerCase();
    return ext === "ttf" || ext === "otf";
  }

  async function downloadSingleFontFixed(font, link) {
    if (!font || typeof fetchFontBlob !== "function" || typeof downloadBlob !== "function") {
      throw new Error("다운로드 준비를 아직 끝내지 못했습니다. 잠시 후 다시 눌러 주세요.");
    }
    const oldHtml = link ? link.innerHTML : "";
    if (link) { link.dataset.busy = "1"; link.setAttribute("aria-disabled", "true"); link.style.pointerEvents = "none"; }
    const bar = document.querySelector("#selectionBar");
    const wasHidden = bar ? bar.hidden : false;
    if (bar) { bar.dataset.forceOpen = "1"; bar.hidden = false; }
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
      if (link) { link.dataset.busy = "0"; link.removeAttribute("aria-disabled"); link.style.pointerEvents = ""; link.innerHTML = oldHtml; }
      if (bar) { delete bar.dataset.forceOpen; if (wasHidden) setTimeout(() => { if (!window.selected || !window.selected.size) bar.hidden = true; }, 2000); }
    }
  }

  async function downloadSingleIphone(font, button) {
    if (!font || !canMakeIphone(font)) throw new Error("이 파일은 iPhone 구성으로 만들 수 없습니다.");
    if (typeof fetchFontBlob !== "function") throw new Error("다운로드 준비를 아직 끝내지 못했습니다. 잠시 후 다시 눌러 주세요.");
    const oldHtml = button ? button.innerHTML : "";
    if (button) { button.dataset.busy = "1"; button.disabled = true; }
    const bar = document.querySelector("#selectionBar");
    if (bar) { bar.dataset.forceOpen = "1"; bar.hidden = false; }
    if (typeof startDownloadMusic === "function") startDownloadMusic();
    try {
      await waitForSimulatedDownload();
      if (typeof updateDownloadProgress === "function") updateDownloadProgress(100, font.name + " iPhone 구성을 만드는 중…");
      const blob = await fetchFontBlob(font);
      if (blob.size > 8 * 1024 * 1024) throw new Error("8MB를 넘는 파일은 iPhone 구성에 넣을 수 없습니다.");
      const family = "FontorySingle-" + String(font.name || "font").replace(/[^a-zA-Z0-9_-]/g, "-");
      const testFace = new FontFace(family, await blob.arrayBuffer(), { style: "normal", weight: "400" });
      const loaded = await testFace.load();
      if (loaded.status !== "loaded") throw new Error("이 폰트 파일은 iPhone용으로 쓸 수 없습니다.");
      const toBase64 = typeof blobToBase64 === "function" ? blobToBase64 : (value) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] || ""); reader.onerror = reject; reader.readAsDataURL(value); });
      const wrap = typeof wrapBase64 === "function" ? wrapBase64 : (data) => data.replace(/(.{76})/g, "$1\n");
      const xmlEscape = typeof escapeXml === "function" ? escapeXml : (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "'" }[c]));
      const makeId = typeof uuid === "function" ? uuid : () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });
      const base64 = wrap(await toBase64(blob));
      const fontId = makeId();
      const profileId = makeId();
      const fileName = (font.file || "").split("/").pop() || (font.name + ".ttf");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>PayloadContent</key><array><dict><key>Font</key><data>${base64}</data><key>Name</key><string>${xmlEscape(fileName)}</string><key>PayloadDisplayName</key><string>${xmlEscape(font.name)}</string><key>PayloadIdentifier</key><string>fontory.iphone-fonts.font.${fontId}</string><key>PayloadType</key><string>com.apple.font</string><key>PayloadUUID</key><string>${fontId}</string><key>PayloadVersion</key><integer>1</integer></dict></array><key>PayloadDescription</key><string>Fontory iPhone font</string><key>PayloadDisplayName</key><string>Fontory \u00b7 ${xmlEscape(font.name)}</string><key>PayloadIdentifier</key><string>fontory.iphone-fonts.${profileId}</string><key>PayloadOrganization</key><string>Fontory</string><key>PayloadRemovalDisallowed</key><false/><key>PayloadType</key><string>Configuration</string><key>PayloadUUID</key><string>${profileId}</string><key>PayloadVersion</key><integer>1</integer></dict></plist>`;
      const profile = new Blob([xml], { type: "application/x-apple-aspen-config" });
      if (typeof downloadBlob === "function") await downloadBlob(profile, "Fontory-" + fileName.replace(/\.[^.]+$/, "") + ".mobileconfig");
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(profile); a.download = "Fontory-iPhone.mobileconfig"; a.click(); }
      if (typeof updateDownloadProgress === "function") updateDownloadProgress(100, "iPhone 구성을 만들었습니다.");
      if (typeof hideDownloadProgressSoon === "function") hideDownloadProgressSoon();
    } finally {
      if (button) { button.dataset.busy = "0"; button.disabled = false; button.innerHTML = oldHtml; }
    }
  }

  function decorateLabel(el, kind) {
    if (!el || el.dataset.osLogo === "1") return;
    const text = (el.textContent || "").replace(/^[\uD83C\uDFE1\uD83C\uDF4E]\s*/, "").trim();
    el.innerHTML = (kind === "win" ? WIN_LOGO : APPLE_LOGO) + "<span>" + (text || (kind === "win" ? "Windows 다운로드" : "iPhone 다운로드")) + "</span>";
    el.dataset.osLogo = "1";
    el.classList.add(kind === "win" ? "os-win" : "os-ios");
  }

  function enhanceCards() {
    document.querySelectorAll("#fontGrid .font-card").forEach((card) => {
      const actions = card.querySelector(".actions");
      if (!actions) return;
      const win = actions.querySelector("a.download, button.download");
      if (win && !win.classList.contains("os-ios")) decorateLabel(win, "win");
      if (actions.querySelector(".os-ios")) return;
      const font = fontFromCard(card);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "download os-ios";
      if (!font || !canMakeIphone(font)) { btn.disabled = true; btn.innerHTML = APPLE_LOGO + "<span>iPhone 불가</span>"; }
      else { btn.innerHTML = APPLE_LOGO + "<span>iPhone 다운로드</span>"; }
      btn.dataset.osLogo = "1";
      if (win && win.nextSibling) actions.insertBefore(btn, win.nextSibling);
      else actions.insertBefore(btn, actions.firstChild);
    });
  }

  function enhanceBar() {
    const win = document.querySelector("#downloadWindows");
    const ios = document.querySelector("#makeProfile");
    if (win) decorateLabel(win, "win");
    if (ios) decorateLabel(ios, "ios");
  }

  const ready = setInterval(() => {
    if (typeof fetchFontBlob === "function") {
      clearInterval(ready);
      window.waitForSimulatedDownload = waitForSimulatedDownload;
      enhanceCards();
      enhanceBar();
    }
  }, 100);

  const grid = document.querySelector("#fontGrid");
  if (grid) new MutationObserver(() => enhanceCards()).observe(grid, { childList: true, subtree: true });
  enhanceCards();
  enhanceBar();

  document.addEventListener("click", (event) => {
    const iosBtn = event.target.closest && event.target.closest(".os-ios");
    const winLink = event.target.closest && event.target.closest("a.download");
    if (iosBtn && iosBtn.id !== "makeProfile") {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (iosBtn.dataset.busy === "1" || iosBtn.disabled) return;
      downloadSingleIphone(fontFromCard(iosBtn.closest(".font-card")), iosBtn).catch((error) => alert(error.message || "iPhone 구성을 만들지 못했습니다."));
      return;
    }
    if (winLink && winLink.id !== "downloadWindows") {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (winLink.dataset.busy === "1") return;
      const font = fontFromCard(winLink.closest(".font-card"));
      if (!font) return;
      downloadSingleFontFixed(font, winLink).catch((error) => alert(error.message || "다운로드하지 못했습니다."));
    }
  }, true);

  const style = document.createElement("style");
  style.textContent = `.actions{flex-wrap:wrap}.actions .download{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:42px}.download.os-ios{background:#111;color:#fff}body.dark .download.os-ios{background:#f5f5f7;color:#111}.os-logo{width:14px;height:14px;flex:0 0 14px;display:block}#downloadWindows,#makeProfile{display:inline-flex;align-items:center;justify-content:center;gap:7px}#downloadWindows .os-logo,#makeProfile .os-logo{width:13px;height:13px}`;
  document.head.appendChild(style);
})();
