(() => {
  const start = () => {
    const targets = [...document.querySelectorAll("[data-typing-greeting]")].filter((target) => target.dataset.typed !== "true");
    if (!targets.length) return;
    targets.forEach((target) => { target.dataset.typed = "true"; });
    const text = "안녕하세요, Fontory입니다. 로그인해 주셔서 감사합니다. 원하는 폰트를 자유롭게 찾아보고, 나만의 폰트 환경을 만들어보세요.";
    let index = 0;
    let deleting = false;
    const typeNext = () => {
      targets.forEach((target) => { target.textContent = text.slice(0, index); });
      if (!deleting && index < text.length) {
        index += 1;
        window.setTimeout(typeNext, index === 1 ? 180 : 75);
      } else if (!deleting) {
        deleting = true;
        window.setTimeout(typeNext, 2200);
      } else if (index > 0) {
        index -= 1;
        window.setTimeout(typeNext, 42);
      } else {
        deleting = false;
        window.setTimeout(typeNext, 650);
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
