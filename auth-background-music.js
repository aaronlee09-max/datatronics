(() => {
  const source = "./assets/fontory-download-music.mp3?v=20260929-padded1";
  const audio = new Audio(source);
  audio.preload = "auto";
  audio.loop = true;
  audio.autoplay = false;
  audio.playsInline = true;
  audio.setAttribute("aria-hidden", "true");
  audio.volume = 0.28;
  let starting = false;

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    starting = false;
  };

  const waitUntilReady = () => {
    if (audio.readyState >= 2) return Promise.resolve();
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        audio.removeEventListener("loadeddata", done);
        audio.removeEventListener("canplay", done);
        resolve();
      };
      audio.addEventListener("loadeddata", done, { once: true });
      audio.addEventListener("canplay", done, { once: true });
      audio.load();
    });
  };

  const playFromBeginning = () => {
    if (starting || !document.body.classList.contains("auth-locked")) return;
    starting = true;
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    waitUntilReady().then(() => {
      if (!document.body.classList.contains("auth-locked")) throw new Error("login screen closed");
      return audio.play();
    }).then(() => {
      starting = false;
    }).catch(() => {
      starting = false;
    });
  };

  const sync = () => {
    if (!document.body.classList.contains("auth-locked") || !document.querySelector("#fontoryAuth")) stop();
  };

  window.addEventListener("fontory-auth-unlocked", stop);
  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      if (event.target.closest("#fontoryAuth")) playFromBeginning();
    }, { passive: true });
  });
  new MutationObserver(sync).observe(document.body, { attributes: true, childList: true, subtree: true });
  sync();
})();
