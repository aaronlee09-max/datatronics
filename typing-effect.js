(() => {
  const start = () => {
    const targets = [...document.querySelectorAll("[data-typing-greeting]")].filter((target) => target.dataset.typed !== "true");
    if (!targets.length) return;
    targets.forEach((target) => { target.dataset.typed = "true"; });
    const text = "안녕하세요, Fontory입니다.";
    let index = 0;
    const typeNext = () => {
      targets.forEach((target) => { target.textContent = text.slice(0, index); });
      if (index < text.length) {
        index += 1;
        window.setTimeout(typeNext, index === 1 ? 180 : 75);
      }
    };
    typeNext();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
  if (document.body) {
    new MutationObserver(start).observe(document.body, { childList: true, subtree: true });
  }
})();
