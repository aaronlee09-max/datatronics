(() => {
  const typeText = (targets, text) => {
    if (!targets.length) return;
    targets.forEach((target) => { target.dataset.typed = "true"; });
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

  const start = (root = document) => {
    const greetingTargets = [...root.querySelectorAll("[data-typing-greeting]")].filter((target) => target.dataset.typed !== "true");
    const creditTargets = [...root.querySelectorAll("[data-typing-credit]")].filter((target) => target.dataset.typed !== "true");
    typeText(greetingTargets, "안녕하세요, Fontory입니다. 지금 로그인 하시고 다양한 폰트를 누려보세요.");
    typeText(creditTargets, "Made by 우주지구대통령님");
  };

  window.fontoryStartTyping = start;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => start(), { once: true });
  } else {
    start();
  }

  new MutationObserver(() => start()).observe(document.body, { childList: true, subtree: true });
})();