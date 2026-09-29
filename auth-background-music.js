(() => {
  const source = "./assets/fontory-download-music.mp3?v=20260929-full";
  const audio = new Audio(source);
  audio.preload = "auto";
  audio.loop = true;
  audio.autoplay = true;
  audio.playsInline = true;
  audio.setAttribute("aria-hidden", "true");
  audio.volume = 0.28;
  let active = false;
  let mutedFallback = false;
  let starting = false;

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    mutedFallback = false;
    active = false;
    starting = false;
  };
  const start = () => {
    if (active || starting || !document.body.classList.contains("auth-locked")) return;
    starting = true;
    audio.play().then(() => { active = true; starting = false; }).catch(() => {
      // Safari/iOS can reject audible autoplay. Start silently in the background,
      // then restore sound on the first user gesture.
      mutedFallback = true;
      audio.muted = true;
      audio.play().then(() => { active = true; starting = false; }).catch(() => { starting = false; });
    });
  };
  const unmuteAfterGesture = () => {
    if (!mutedFallback || !document.body.classList.contains("auth-locked")) return;
    audio.muted = false;
    mutedFallback = false;
    audio.play().then(() => { active = true; }).catch(() => {});
  };
  const sync = () => {
    if (document.body.classList.contains("auth-locked") && document.querySelector("#fontoryAuth")) start();
    else stop();
  };
  window.addEventListener("fontory-auth-unlocked", stop);
  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, start, { passive: true });
    document.addEventListener(eventName, unmuteAfterGesture, { passive: true });
  });
  new MutationObserver(sync).observe(document.body, { attributes: true, childList: true, subtree: true });
  sync();
})();
