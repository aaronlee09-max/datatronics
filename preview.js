(() => {
  const titleBrand = document.querySelector("#previewTitleBrand");
  const titleWord = document.querySelector("#previewTitleWord");
  const title = document.querySelector("#previewTitle");
  if (titleBrand && titleWord && title) {
    const brand = "Fontory";
    const word = "Preview.";
    let index = 0;
    let deleting = false;
    title.classList.add("typing-cursor");
    const typeTitle = () => {
      const full = `${brand} ${word}`;
      const visible = deleting ? full.slice(0, index) : full.slice(0, index);
      const brandLength = Math.min(brand.length, visible.length);
      titleBrand.textContent = visible.slice(0, brandLength);
      titleWord.textContent = visible.length > brand.length ? ` ${visible.slice(brand.length + 1)}` : "";
      if (!deleting && index < full.length) {
        index += 1;
        window.setTimeout(typeTitle, index === 1 ? 180 : 80);
      } else if (!deleting) {
        deleting = true;
        window.setTimeout(typeTitle, 1800);
      } else if (index > 0) {
        index -= 1;
        window.setTimeout(typeTitle, 45);
      } else {
        deleting = false;
        window.setTimeout(typeTitle, 650);
      }
    };
    typeTitle();
  }
  const PAGE_SIZE = 24;
  const assetUrl = (font) => new URL(font.file, window.location.href).href;
  const ext = (font) => String(font.file || "").split(".").pop().toLowerCase();
  const canPreview = (font) => ["ttf", "otf", "woff", "woff2"].includes(ext(font));
  const familyFor = (font) => `FontoryPublicPreview-${String(font.id || font.file || font.name).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fontsById = new Map();
  const loaded = new Set();
  const failed = new Set();
  let fonts = [];
  let category = "전체";
  let page = 1;
  const grid = document.querySelector("#previewGrid");
  const search = document.querySelector("#previewSearch");
  const categories = document.querySelector("#previewCategories");
  const count = document.querySelector("#previewCount");
  const empty = document.querySelector("#previewEmpty");
  const pagination = document.querySelector("#previewPagination");
  const status = document.querySelector("#previewStatus");

  function matches(font, q) {
    if (category !== "전체" && font.category !== category) return false;
    if (!q) return true;
    return `${font.name} ${font.family || ""} ${font.style || ""} ${font.category || ""}`.toLowerCase().includes(q);
  }
  function renderCategories() {
    const names = ["전체", ...new Set(fonts.map((font) => font.category).filter(Boolean))];
    categories.innerHTML = names.map((name) => `<button class="chip ${category === name ? "active" : ""}" type="button" data-category="${escapeHtml(name)}">${escapeHtml(name)} ${name === "전체" ? fonts.length : fonts.filter((font) => font.category === name).length}</button>`).join("");
    categories.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { category = button.dataset.category; page = 1; render(); }));
  }
  function render() {
    renderCategories();
    const filtered = fonts.filter((font) => matches(font, search.value.trim().toLowerCase()));
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    page = Math.min(page, pages);
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    count.textContent = `${filtered.length} fonts · ${page} / ${pages}`;
    empty.hidden = filtered.length !== 0;
    grid.innerHTML = visible.map((font) => {
      const id = String(font.id || font.file || font.name);
      const preview = font.preview || "오늘도 예쁘게 기록해요";
      const failedClass = failed.has(id) ? "preview-failed" : "";
      return `<article class="font-card preview-card" data-id="${escapeHtml(id)}" data-file="${escapeHtml(font.file || "")}">
        <div class="font-meta"><span class="font-name">${escapeHtml(font.name)}</span><span class="tag">${escapeHtml(font.category || "기타")}</span></div>
        <div class="preview-stack"><div class="preview ${failedClass}" data-preview="ko">${escapeHtml(preview)}</div><div class="preview-sub ${failedClass}" data-preview="mix">가나다 ABC 123</div></div>
        <div class="font-info preview-meta">${escapeHtml([font.family, font.style].filter(Boolean).join(" · ") || "실제 폰트 미리보기")}<br><span class="windows-help">로그인 전에는 파일 다운로드가 제한됩니다.</span></div>
        <div class="preview-actions"><span class="preview-locked">다운로드 잠김</span> <a class="preview-login-link" href="./">로그인하고 다운로드</a></div>
      </article>`;
    }).join("");
    pagination.hidden = filtered.length <= PAGE_SIZE;
    pagination.innerHTML = pagination.hidden ? "" : `<button type="button" data-page="prev" ${page === 1 ? "disabled" : ""}>이전</button><span>${page} / ${pages}</span><button type="button" data-page="next" ${page === pages ? "disabled" : ""}>다음</button>`;
    pagination.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => { page += button.dataset.page === "next" ? 1 : -1; render(); window.scrollTo({ top: document.querySelector(".section-head").offsetTop - 20, behavior: "smooth" }); }));
    visible.forEach(loadPreview);
  }
  async function loadPreview(font) {
    if (!canPreview(font) || loaded.has(font.file) || failed.has(String(font.id || font.file || font.name))) return;
    const id = String(font.id || font.file || font.name);
    try {
      const face = await new FontFace(familyFor(font), `url("${assetUrl(font)}") format("${ext(font)}")`, { display: "swap" }).load();
      document.fonts.add(face); loaded.add(font.file);
      grid.querySelectorAll(`[data-id="${CSS.escape(id)}"] [data-preview]`).forEach((node) => { node.style.fontFamily = `"${familyFor(font)}", sans-serif`; });
    } catch {
      failed.add(id);
      grid.querySelectorAll(`[data-id="${CSS.escape(id)}"] [data-preview]`).forEach((node) => { node.classList.add("preview-failed"); node.textContent = "미리보기 로드 실패"; });
    }
  }
  document.querySelector("#themeBtn").addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("font-theme", document.body.classList.contains("dark") ? "dark" : "light"); });
  if (localStorage.getItem("font-theme") === "dark") document.body.classList.add("dark");
  search.addEventListener("input", () => { page = 1; render(); });
  fetch("./fonts.json", { cache: "no-store" }).then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then((data) => { fonts = Array.isArray(data) ? data : []; fonts.forEach((font) => fontsById.set(font.id, font)); render(); }).catch(() => { status.hidden = false; status.textContent = "폰트 목록을 불러오지 못했습니다."; });
})();
