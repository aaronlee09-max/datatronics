(() => {
  const mount = () => {
    if (!document.body || document.querySelector(".ambient-layer")) return;
    const layer = document.createElement("div");
    layer.className = "ambient-layer";
    layer.setAttribute("aria-hidden", "true");
    ["ambient-orb orb-one", "ambient-orb orb-two", "ambient-orb orb-three"].forEach((className) => {
      const orb = document.createElement("span");
      orb.className = className;
      layer.appendChild(orb);
    });
    const glyphs = ["A", "あ", "한", "가", "B", "文", "✦", "𝒜", "폰", "G", "∞", "글", "R", "字", "Aa", "S", "ㅋ", "𝓕", "N", "ㅍ"];
    glyphs.forEach((glyph, index) => {
      const node = document.createElement("span");
      node.className = "ambient-glyph";
      node.textContent = glyph;
      node.style.setProperty("--x", `${(index * 37 + 8) % 104}%`);
      node.style.setProperty("--y", `${(index * 53 + 4) % 98}%`);
      node.style.setProperty("--delay", `${(index % 7) * -1.8}s`);
      node.style.setProperty("--duration", `${14 + (index % 6) * 3}s`);
      node.style.setProperty("--size", `${28 + (index % 5) * 16}px`);
      node.style.setProperty("--rotate", `${-18 + (index % 8) * 7}deg`);
      node.style.setProperty("--blur", `${2 + (index % 4)}px`);
      layer.appendChild(node);
    });
    document.body.prepend(layer);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
