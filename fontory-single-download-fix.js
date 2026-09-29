(() => {
  const MUSIC_SRC = "./assets/fontory-download-music.mp3?v=20260929-song-progress";
  // 현재 배포된 다운로드 음악의 길이(초). 진행바는 파일 수신률이 아니라 이 곡의 재생률이다.
  const SONG_DURATION_SECONDS = 206.352;
  let music = null;
  let activeDownload = false;

  function ensureProgress() {
    let panel = document.querySelector("#fontorySingleDownloadProgress");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "fontorySingleDownloadProgress";
    panel.className = "fontory-single-download-progress";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="fontory-single-download-head">
        <strong id="fontorySingleDownloadLabel">노래 준비 중…</strong>
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

  function setProgress(percent, text) {
    const panel = ensureProgress();
    const meter = panel.querySelector("#fontorySingleDownloadMeter");
    const value = panel.querySelector("#fontorySingleDownloadValue");
    const label = panel.querySelector("#fontorySingleDownloadLabel");
    const safe = Math.max(0, Math.min(100, Math.round(percent)));
    panel.hidden = false;
    meter.value = safe;
    value.textContent = `${safe}%`;
    if (text) label.textContent = text;
  }

  function hideProgress() {
    setTimeout(() => {
      const panel = document.querySelector("#fontorySingleDownloadProgress");
      if (panel) panel.hidden = true;
    }, 1800);
  }

  function getMusic() {
    if (!music) {
      music = new Audio(MUSIC_SRC);
      music.preload = "auto";
      music.volume = 0.45;
    }
    return music;
  }

  function stopMusic() {
    if (!music) return;
    music.pause();
    music.currentTime = 0;
  }

  function playSongToEnd(fontName) {
    const audio = getMusic();
    audio.currentTime = 0;

    return new Promise((resolve, reject) => {
      let settled = false;
      let animationFrame = 0;
      const finish = (error) => {
        if (settled) return;
        settled = true;
        cancelAnimationFrame(animationFrame);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        if (error) reject(error);
        else resolve();
      };
      const onEnded = () => {
        setProgress(100, `${fontName} · 노래 완료 · 다운로드 시작…`);
        finish();
      };
      const onError = () => finish(new Error("다운로드 음악을 재생하지 못했습니다."));
      const updateSongProgress = () => {
        if (settled) return;
        const duration = Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : SONG_DURATION_SECONDS;
        const percent = Math.min(100, (audio.currentTime / duration) * 100);
        setProgress(percent, `${fontName} · 노래 재생 중…`);
        animationFrame = requestAnimationFrame(updateSongProgress);
      };

      audio.addEventListener("ended", onEnded, { once: true });
      audio.addEventListener("error", onError, { once: true });
      setProgress(0, `${fontName} · 노래 재생 중…`);
      updateSongProgress();
      const playPromise = audio.play();
      if (playPromise?.catch) playPromise.catch(onError);
    });
  }

  function restoreAnchor(button, original) {
    const restored = document.createElement("a");
    restored.className = original.className;
    restored.href = original.href;
    restored.download = original.download;
    restored.textContent = original.textContent;
    restored.dataset.fontorySingleBound = "1";
    restored.addEventListener("click", (event) => {
      event.preventDefault();
      downloadOne(restored);
    });
    button.replaceWith(restored);
  }

  async function downloadOne(anchor) {
    if (activeDownload) return;
    if (typeof window.requireFontoryLogin === "function") {
      const unlocked = await window.requireFontoryLogin();
      if (!unlocked) return;
    }
    const card = anchor.closest(".font-card");
    const file = card?.dataset.file;
    if (!file) return;

    const original = {
      className: anchor.className,
      href: anchor.href,
      download: anchor.download,
      textContent: anchor.textContent,
    };
    const filename = file.split("/").pop() || "font-file";
    const fontName = card?.querySelector(".font-name")?.textContent?.trim() || filename;
    const font = { name: fontName, file };

    const button = document.createElement("button");
    button.type = "button";
    button.className = original.className;
    button.textContent = "노래 재생 중…";
    button.disabled = true;
    anchor.replaceWith(button);
    activeDownload = true;

    try {
      // 의도적으로 실제 파일 수신 전에 곡 전체를 재생한다.
      await playSongToEnd(fontName);
      const blob = await fetchFontBlob(font, () => {});
      setProgress(100, `${fontName} · 파일 저장 중…`);
      await downloadBlob(blob, filename);
      setProgress(100, `${fontName} · 다운로드 완료 ✓`);
      restoreAnchor(button, original);
      hideProgress();
    } catch (error) {
      setProgress(0, error?.message || "다운로드에 실패했습니다.");
      setTimeout(() => {
        if (button.isConnected) restoreAnchor(button, original);
      }, 1500);
    } finally {
      activeDownload = false;
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
  `;
  document.head.appendChild(style);
})();
