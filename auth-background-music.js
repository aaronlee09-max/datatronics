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
  let userStarted = false;

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    starting = false;
    userStarted = false;
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
    userStarted = true;
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
      userStarted = false;
    });
  };

  const sync = () => {
    if (!document.body.classList.contains("auth-locked") || !document.querySelector("#fontoryAuth")) stop();
  };

  window.addEventListener("fontory-auth-unlocked", stop);
  audio.addEventListener("ended", () => {
    if (userStarted && document.body.classList.contains("auth-locked")) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  });
  audio.addEventListener("pause", () => {
    if (!userStarted || starting || !document.body.classList.contains("auth-locked")) return;
    window.setTimeout(() => {
      if (userStarted && !starting && document.body.classList.contains("auth-locked")) audio.play().catch(() => {});
    }, 250);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && userStarted && document.body.classList.contains("auth-locked")) audio.play().catch(() => {});
  });
  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      if (userStarted) return;
      if (event.target.closest("#fontoryAuth")) playFromBeginning();
    }, { passive: true });
  });
  new MutationObserver(sync).observe(document.body, { attributes: true, childList: true, subtree: true });
  sync();
})();
