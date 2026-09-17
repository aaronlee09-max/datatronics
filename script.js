const CATEGORIES = [
  "전체",
  "귀여운 둥근폰트",
  "기본 한국폰트",
  "배달의민족",
  "독립서체",
  "개성폰트",
  "기타",
];

let fonts = [];
const selected = new Set();
let activeCategory = "전체";
const loadedFaces = new Set();
const PAGE_SIZE = 36;
let page = 1;

const grid = document.querySelector("#fontGrid");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const search = document.querySelector("#search");
const categoryBar = document.querySelector("#categoryBar");
const statusBanner = document.querySelector("#statusBanner");
const pagination = document.querySelector("#pagination");

function fontId(font) {
  return font.id || font.file || font.name;
}

function canInstall(font) {
  if (!font.file) return false;
  const ext = String(font.file).split(".").pop().toLowerCase();
  return ext === "ttf" || ext === "otf";
}

function renderCategories() {
  categoryBar.innerHTML = CATEGORIES.map((cat) => {
    const n = cat === "전체" ? fonts.length : fonts.filter((f) => f.category === cat).length;
    return `<button class="chip ${activeCategory === cat ? "active" : ""}" type="button" data-cat="${escapeAttr(cat)}">${escapeHtml(cat)} ${n}</button>`;
  }).join("");
  categoryBar.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      page = 1;
      render();
    });
  });
}

function matchesQuery(font, q) {
  if (!q) return true;
  const hay = `${font.name} ${font.family || ""} ${font.style || ""} ${font.category || ""}`.toLowerCase();
  return hay.includes(q);
}

function render() {
  renderCategories();
  const q = search.value.trim().toLowerCase();
  const filtered = fonts.filter((f) => {
    const catOk = activeCategory === "전체" || f.category === activeCategory;
    return catOk && matchesQuery(f, q);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  page = Math.min(page, pages);
  const list = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  count.textContent = `${filtered.length} fonts · ${page} / ${pages}`;
  empty.hidden = filtered.length !== 0;
  empty.textContent = fonts.length ? "검색 결과가 없습니다." : "등록된 폰트 파일이 아직 없습니다.";

  grid.innerHTML = list.map((f) => {
    const id = fontId(f);
    const preview = f.preview || "오늘도 예쁘게 기록해요";
    const face = f.family || f.name;
    return `<article class="font-card ${selected.has(id) ? "selected" : ""}" data-id="${escapeAttr(id)}" data-file="${escapeAttr(f.file || "")}" data-family="${escapeAttr(face)}">
      <label class="select-row">
        <input class="font-check" type="checkbox" data-id="${escapeAttr(id)}" ${selected.has(id) ? "checked" : ""} ${canInstall(f) ? "" : "disabled"}>
        <span>담기</span>
      </label>
      <div class="font-meta">
        <span class="font-name">${escapeHtml(f.name)}</span>
        <span class="tag">${escapeHtml(f.category || "기타")}</span>
      </div>
      <div class="preview-stack">
        <div class="preview" data-preview="ko">${escapeHtml(preview)}</div>
        <div class="preview-sub" data-preview="mix">가나다 ABC 123</div>
      </div>
      <div class="font-info">${escapeHtml([f.family, f.style].filter(Boolean).join(" · ") || "미리보기는 파일이 있을 때 적용됩니다.")}</div>
      <div class="actions">
        ${f.file
          ? `<a class="download" href="${encodeURI(f.file)}" download>다운로드</a>`
          : `<button class="download" type="button" disabled>파일 없음</button>`}
        <button class="details" type="button" data-copy="${escapeAttr(f.name)}">이름 복사</button>
      </div>
    </article>`;
  }).join("");

  pagination.hidden = filtered.length <= PAGE_SIZE;
  pagination.innerHTML = pagination.hidden ? "" : `
    <button type="button" data-page="prev" ${page === 1 ? "disabled" : ""}>이전</button>
    <span>${page} / ${pages}</span>
    <button type="button" data-page="next" ${page === pages ? "disabled" : ""}>다음</button>`;
  pagination.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      page += button.dataset.page === "next" ? 1 : -1;
      render();
      document.querySelector(".section-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  grid.querySelectorAll(".font-check").forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) selected.add(box.dataset.id);
      else selected.delete(box.dataset.id);
      render();
    });
  });
  grid.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.textContent;
        btn.textContent = "복사됨 ✓";
        setTimeout(() => { btn.textContent = old; }, 1000);
      } catch {}
    });
  });

  applyVisiblePreviews(list);
  updateBuilder();
}

function applyVisiblePreviews(list) {
  list.forEach((font) => {
    if (!font.file || !font.family) return;
    const key = font.file;
    if (loadedFaces.has(key)) {
      styleCards(font);
      return;
    }
    const face = new FontFace(font.family, `url(${encodeURI(font.file)})`);
    face.load().then((loaded) => {
      document.fonts.add(loaded);
      loadedFaces.add(key);
      styleCards(font);
    }).catch(() => {});
  });
}

function styleCards(font) {
  grid.querySelectorAll(".font-card").forEach((card) => {
    if (card.dataset.file === font.file) {
      card.querySelectorAll("[data-preview]").forEach((el) => {
        el.style.fontFamily = `"${font.family}", sans-serif`;
      });
    }
  });
}

function updateBuilder() {
  const bar = document.querySelector("#selectionBar");
  const names = document.querySelector("#selectedNames");
  const btn = document.querySelector("#makeProfile");
  if (!bar) return;
  const chosen = fonts.filter((f) => selected.has(fontId(f)) && canInstall(f));
  bar.hidden = chosen.length === 0;
  names.textContent = chosen.length
    ? `${chosen.length}개 선택 · ${chosen.map((f) => f.name).join(", ")}`
    : "";
  btn.disabled = chosen.length === 0;
}

async function makeMobileConfig() {
  const chosen = fonts.filter((f) => selected.has(fontId(f)) && canInstall(f));
  if (!chosen.length) return;
  if (chosen.length > 20) {
    const ok = confirm(`선택한 폰트가 ${chosen.length}개입니다. 큰 프로파일은 생성·설치가 실패할 수 있습니다. 계속할까요?`);
    if (!ok) return;
  }

  const payloads = [];
  for (const font of chosen) {
    const response = await fetch(font.file);
    if (!response.ok) throw new Error(`${font.name} 파일을 불러오지 못했습니다.`);
    const blob = await response.blob();
    if (blob.size > 8 * 1024 * 1024) {
      throw new Error(`${font.name}이(가) 커서 브라우저에서 한 번에 넣지 않았습니다.`);
    }
    const base64 = await blobToBase64(blob);
    payloads.push({
      name: font.name,
      fileName: (font.file.split("/").pop() || `${font.name}.ttf`),
      data: wrapBase64(base64),
    });
  }

  const profileUuid = uuid();
  const fontXml = payloads.map((p) => {
    const id = uuid();
    return `<dict>
      <key>Font</key>
      <data>${p.data}</data>
      <key>Name</key>
      <string>${escapeXml(p.fileName)}</string>
      <key>PayloadDisplayName</key>
      <string>${escapeXml(p.name)}</string>
      <key>PayloadIdentifier</key>
      <string>datatronics.iphone-fonts.font.${id}</string>
      <key>PayloadType</key>
      <string>com.apple.font</string>
      <key>PayloadUUID</key>
      <string>${id}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
    </dict>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>${fontXml}</array>
  <key>PayloadDescription</key>
  <string>선택한 글꼴을 iPhone에 설치하기 위한 구성 프로파일입니다. 실제 기기 설치는 테스트가 필요합니다.</string>
  <key>PayloadDisplayName</key>
  <string>iPhone Fonts · 선택한 폰트</string>
  <key>PayloadIdentifier</key>
  <string>datatronics.iphone-fonts.${profileUuid}</string>
  <key>PayloadOrganization</key>
  <string>iPhone Fonts</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${profileUuid}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

  const blob = new Blob([xml], { type: "application/x-apple-aspen-config" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "iPhone-Fonts.mobileconfig";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function wrapBase64(data) {
  return data.replace(/(.{76})/g, "$1\n");
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function escapeAttr(value) { return escapeHtml(value); }
function escapeXml(value) { return escapeHtml(value); }

search.addEventListener("input", () => { page = 1; render(); });
document.querySelector("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("font-theme", document.body.classList.contains("dark") ? "dark" : "light");
});
document.querySelector("#makeProfile").addEventListener("click", () => {
  makeMobileConfig().catch((error) => alert(error.message));
});
if (localStorage.getItem("font-theme") === "dark") document.body.classList.add("dark");

async function init() {
  try {
    const response = await fetch("./fonts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("fonts.json을 불러오지 못했습니다.");
    const data = await response.json();
    fonts = Array.isArray(data) ? data : [];
    if (!fonts.length) {
      statusBanner.hidden = false;
      statusBanner.textContent = "원본 폰트 ZIP이 저장소에서 확인되지 않아 카드에 연결할 파일이 없습니다. 폰트 파일을 fonts/ 아래 카테고리 폴더에 넣은 뒤 fonts.json을 갱신하면 목록이 채워집니다.";
    }
    render();
  } catch (error) {
    fonts = [];
    count.textContent = "0 fonts";
    empty.hidden = false;
    empty.textContent = "폰트 목록을 불러오지 못했습니다.";
    console.error(error);
  }
}

init();
