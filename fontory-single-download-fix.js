(() => {
  const MUSIC_SRC = "./assets/fontory-download-music.mp3?v=20260929-single";
  let music = null;

  function ensureProgress() {
    let panel = document.querySelector("#fontorySingleDownloadProgress");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "fontorySingleDownloadProgress";
    panel.className = "fontory-single-download-progress";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="fontory-single-download-head">
        <strong id="fontorySingleDownloadLabel">다운로드 준비 중…</strong>
        <span id="fontorySingleDownloadValue">0%</span>
      </div>
      <progress id="fontorySingleDownloadMeter" max="100" value="0"></progress>
    `;
    const main = document.querySelector("main");
    const banner = document.querySelector("#statusBanner");
    if (main) {
      if (banner?.nextSibling) main.insertBefore(panel, banner.nextSibling);
      else main.prepend(panel);
    } else {
      document.body.appendChild(panel);
    }
    return panel;
  }

  function setProgress(percent, text, indeterminate = false) {
    const panel = ensureProgress();
    const meter = panel.querySelector("#fontorySingleDownloadMeter");
    const value = panel.querySelector("#fontorySingleDownloadValue");
    const label = panel.querySelector("#fontorySingleDownloadLabel");
    panel.hidden = false;
    if (indeterminate) {
      meter.removeAttribute("value");
      value.textContent = "…";
    } else {
      const safe = Math.max(0, Math.min(100, Math.round(percent)));
      meter.value = safe;
      value.textContent = safe + "%";
    }
    if (text) label.textContent = text;
  }

  function hideProgress() {
    setTimeout(() => {
      const panel = document.querySelector("#fontorySingleDownloadProgress");
      if (panel) panel.hidden = true;
    }, 1800);
  }

  function startMusic() {
    if (!music) {
      music = new Audio(MUSIC_SRC);
      music.preload = "auto";
      music.volume = 0.45;
    }
    if (!music.paused) return;
    music.currentTime = 0;
    music.play().catch(() => {});
  }

  function stopMusic() {
    if (!music) return;
    music.pause();
    music.currentTime = 0;
  }

  async function downloadOne(anchor) {
    const card = anchor.closest(".font-card");
    const file = card?.dataset.file;
    if (!file) return;

    const filename = file.split("/").pop() || "font-file";
    const font = {
      name: card?.querySelector(".font-name")?.textContent?.trim() || filename,
      file,
    };

    const button = document.createElement("button");
    button.type = "button";
    button.className = anchor.className;
    button.textContent = "다운로드 중…";
    anchor.replaceWith(button);
    button.disabled = true;

    startMusic();
    try {
      setProgress(0, font.name + " 다운로드 준비 중…", true);
      const blob = await fetchFontBlob(font, (ratio) => {
        if (ratio > 0) {
          setProgress(ratio * 100, font.name + " 다운로드 중…");
        } else {
          setProgress(0, font.name + " 다운로드 중…", true);
        }
      });
      setProgress(100, font.name + " 저장 중…");
      await downloadBlob(blob, filename);
      setProgress(100, font.name + " 다운로드 완료 ✓");
      hideProgress();
    } catch (error) {
      setProgress(0, error?.message || "다운로드에 실패했습니다.");
      setTimeout(() => {
        const current = button;
        const restored = document.createElement("a");
        restored.className = anchor.className;
        restored.href = anchor.href;
        restored.download = anchor.download;
        restored.textContent = anchor.textContent;
        restored.addEventListener("click", (event) => {
          event.preventDefault();
          downloadOne(restored);
        });
        current.replaceWith(restored);
      }, 1500);
    } finally {
      stopMusic();
    }
  }

  function bind() {
    document.querySelectorAll("#fontGrid .font-card a.download[download]").forEach((anchor) => {
      if (anchor.dataset.fontorySingleBound === "1") return;
      anchor.dataset.fontorySingleBound = "1";
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        downloadOne(anchor);
      });
    });
  }

  const grid = document.querySelector("#fontGrid");
  if (grid) new MutationObserver(bind).observe(grid, { childList: true, subtree: true });
  bind();

  const style = document.createElement("style");
  style.textContent = `
    .fontory-single-download-progress {
      width: min(620px, calc(100vw - 28px));
      margin: 0 auto 18px;
      padding: 12px 14px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 14px;
      background: rgba(20,20,24,.92);
      color: #fff;
      box-shadow: 0 8px 30px rgba(0,0,0,.18);
    }
    .fontory-single-download-progress[hidden] { display: none; }
    .fontory-single-download-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      font-size: 12px;
    }
    .fontory-single-download-head strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fontory-single-download-progress progress {
      display: block;
      width: 100%;
      height: 7px;
      margin-top: 8px;
      accent-color: #0a84ff;
    }
    .fontory-single-download-progress button { cursor: pointer; }
  `;
  document.head.appendChild(style);
})();