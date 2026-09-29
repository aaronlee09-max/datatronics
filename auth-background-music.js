(() => {
  const source = "./assets/fontory-download-music.mp3?v=20260929-full";
  const audio = new Audio(source);
  audio.preload = "auto";
  audio.loop = false;
  audio.volume = 0.28;
  let active = false;

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    active = false;
  };
  const start = () => {
    if (active || !document.body.classList.contains("auth-locked")) return;
    audio.currentTime = 0;
    audio.play().then(() => { active = true; }).catch(() => {});
  };
  const sync = () => {
    if (document.body.classList.contains("auth-locked") && document.querySelector("#fontoryAuth")) start();
    else stop();
  };
  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => document.addEventListener(eventName, start, { passive: true }));
  new MutationObserver(sync).observe(document.body, { attributes: true, childList: true, subtree: true });
  sync();
})();
