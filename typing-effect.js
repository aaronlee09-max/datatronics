(() => {
  const start = () => {
    const target = document.querySelector("#typingGreeting");
    if (!target || target.dataset.typed === "true") return;
    target.dataset.typed = "true";
    const text = "안녕하세요, Fontory입니다.";
    let index = 0;
    const typeNext = () => {
      target.textContent = text.slice(0, index);
      if (index < text.length) {
        index += 1;
        window.setTimeout(typeNext, index === 1 ? 180 : 75);
      }
    };
    typeNext();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
