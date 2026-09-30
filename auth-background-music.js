(() => {
  let audio = null;
  let source = null;
  let ready = false;
  const ensureAudio = async () => {
    const selected = await (window.fontoryGetSelectedMusic?.() || Promise.resolve({ file: "./assets/fontory-download-music.mp3?v=20260929-padded1" }));
    if (audio && source === selected.file) return audio;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    source = selected.file;
    audio = new Audio(source);
    audio.preload = "auto";
    audio.loop = true;
    audio.autoplay = false;
    audio.playsInline = true;
    audio.setAttribute("aria-hidden", "true");
    audio.volume = 0.28;
    ready = false;
    audio.addEventListener("loadeddata", () => { ready = true; }, { once: true });
    return audio;
  };
  let starting = false;
  let userStarted = false;

  const stop = () => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    starting = false;
    userStarted = false;
  };

  const waitUntilReady = () => {
    if (!audio) return Promise.reject(new Error("audio not ready"));
    if (audio.readyState >= 2 || ready) return Promise.resolve();
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
    userStarted = true;
    ensureAudio().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      return waitUntilReady();
    }).then(() => {
      if (!document.body.classList.contains("auth-locked")) throw new Error("login screen closed");
      return audio.play();
    }).then(() => {
      starting = false;
    }).catch(() => {
      starting = false;
      userStarted = false;
    });
  };

  const sync = () => {
    if (!document.body.classList.contains("auth-locked") || !document.querySelector("#fontoryAuth")) stop();
  };

  window.addEventListener("fontory-auth-unlocked", stop);
  audio?.addEventListener("ended", () => {
    if (userStarted && document.body.classList.contains("auth-locked")) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  });
  audio?.addEventListener("pause", () => {
    if (!userStarted || starting || !document.body.classList.contains("auth-locked")) return;
    window.setTimeout(() => {
      if (userStarted && !starting && document.body.classList.contains("auth-locked")) audio.play().catch(() => {});
    }, 250);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && userStarted && document.body.classList.contains("auth-locked") && audio) audio.play().catch(() => {});
  });
  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      if (event.target.closest("#fontoryAuth")) playFromBeginning();
    }, { passive: true });
  });
  new MutationObserver(sync).observe(document.body, { attributes: true, childList: true, subtree: true });
  document.addEventListener("fontory-music-changed", () => {
    userStarted = false;
    stop();
  });
  sync();
})();
