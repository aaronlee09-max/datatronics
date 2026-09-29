(() => {
  const start = () => {
    const greetingTargets = [...document.querySelectorAll("[data-typing-greeting]")].filter((target) => target.dataset.typed !== "true");
    const creditTargets = [...document.querySelectorAll("[data-typing-credit]")].filter((target) => target.dataset.typed !== "true");
    if (!greetingTargets.length && !creditTargets.length) return;

    const typeText = (targets, text) => {
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

    typeText(greetingTargets, "안녕하세요, Fontory입니다. 지금 로그인 하시고 다양한 폰트를 누려보세요.");
    typeText(creditTargets, "Made by 우주지구대통령님");
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
  if (document.body) {
    new MutationObserver(start).observe(document.body, { childList: true, subtree: true });
  }
})();