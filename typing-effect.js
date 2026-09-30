(() => {
  const start = () => {
    const targets = [...document.querySelectorAll("[data-typing-greeting]")].filter((target) => target.dataset.typed !== "true");
    if (!targets.length) return;
    targets.forEach((target) => { target.dataset.typed = "true"; });
    const text = "로그인하고 Fontory에서 더 다양한 폰트를 만나보세요.";
    let index = 0;
    let deleting = false;
    const typeNext = () => {
      targets.forEach((target) => { target.textContent = text.slice(0, index); });
      if (!deleting && index < text.length) {
        index += 1;
        window.setTimeout(typeNext, index === 1 ? 180 : 75);
      } else if (!deleting) {
        deleting = true;
        window.setTimeout(typeNext, 1800);
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


(() => {
  const startFontory = () => {
    const targets = [...document.querySelectorAll("[data-typing-fontory]")].filter((target) => target.dataset.typedFontory !== "true");
    if (!targets.length) return;
    targets.forEach((target) => { target.dataset.typedFontory = "true"; });
    const text = "안녕하세요, Fontory Fonts 입니다.";
    let index = 0;
    const typeNext = () => {
      targets.forEach((target) => { target.textContent = text.slice(0, index); });
      if (index < text.length) {
        index += 1;
        window.setTimeout(typeNext, index === 1 ? 180 : 75);
      } else {
        window.setTimeout(() => {
          index = 0;
          typeNext();
        }, 2200);
      }
    };
    typeNext();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startFontory, { once: true });
  } else {
    startFontory();
  }
  if (document.body) {
    new MutationObserver(startFontory).observe(document.body, { childList: true, subtree: true });
  }
})();


(() => {
  const startHero = () => {
    const targets = [...document.querySelectorAll("[data-hero-typing]")].filter((target) => target.dataset.typedHero !== "true");
    if (!targets.length) return;
    targets.forEach((target) => { target.dataset.typedHero = "true"; });
    const text = "안녕하세요, Fontory Fonts 입니다.";
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startHero, { once: true });
  else startHero();
  if (document.body) new MutationObserver(startHero).observe(document.body, { childList: true, subtree: true });
})();
