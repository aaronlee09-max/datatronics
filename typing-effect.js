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
  let runId = 0;
  let loggedInAccount = null;
  const getGreeting = () => {
    try {
      const session = loggedInAccount || JSON.parse(sessionStorage.getItem("fontory-auth-v5") || "null");
      if (session?.role === "admin") return "우주지구대통령님, 좋은 하루 보내세요.";
      if (session?.username) return session.username + "님, 오늘도 좋은 하루 보내세요.";
    } catch {}
    return "안녕하세요, Fontory Fonts 입니다.";
  };

  const startFontory = () => {
    const targets = [...document.querySelectorAll("[data-typing-fontory]")];
    if (!targets.length) return;
    const text = getGreeting();
    const myRun = ++runId;
    let index = 0;
    let deleting = false;

    const typeNext = () => {
      if (myRun !== runId) return;
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startFontory, { once: true });
  } else {
    startFontory();
  }
  window.addEventListener("fontory-auth-unlocked", (event) => {
    loggedInAccount = event.detail || null;
    startFontory();
  });
})();
